import {
  ACME_DIRECTORY_URLS,
  AcmeClient,
  AcmeWorkflows,
  CertUtils,
  CryptoKeyUtils,
} from "@fishballpkg/acme";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { createDnsUpdater } from "../src/cloudflare-dns";

const RENEWAL_THRESHOLD_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const ACME_EMAIL = requireEnv("ACME_EMAIL");
const DOMAINS = requireEnv("DOMAINS").split(",");
const CF_API_TOKEN = requireEnv("CF_API_TOKEN");
const CF_ZONE_ID = requireEnv("CF_ZONE_ID");
const CF_ACCOUNT_ID = requireEnv("CF_ACCOUNT_ID");
const R2_BUCKET = requireEnv("R2_BUCKET");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv("CF_R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("CF_R2_SECRET_ACCESS_KEY"),
  },
});

async function getR2Text(key: string): Promise<string | null> {
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
    );
    return (await res.Body?.transformToString()) ?? null;
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "NoSuchKey") return null;
    throw e;
  }
}

async function putR2Text(key: string, body: string): Promise<void> {
  await s3.send(
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body })
  );
}

async function main() {
  const existingJson = await getR2Text("all.pem.json");
  if (existingJson !== null) {
    const { cert } = JSON.parse(existingJson) as { cert: string; key: string };
    const { notAfter } = CertUtils.decodeValidity(cert);
    const remainingMs = notAfter.getTime() - Date.now();
    const remainingDays = Math.floor(remainingMs / MS_PER_DAY);
    if (remainingMs > RENEWAL_THRESHOLD_DAYS * MS_PER_DAY) {
      console.log(
        `Certificate still valid for ${remainingDays} days. Skipping renewal.`
      );
      return;
    }
    console.log(
      `Certificate expires in ${remainingDays} days. Renewing...`
    );
  } else {
    console.log("No existing certificate found. Requesting new certificate...");
  }

  const client = await AcmeClient.init(ACME_DIRECTORY_URLS.LETS_ENCRYPT);

  const existingAccountKey = await getR2Text("acme-account-key.pem");
  let account;
  if (existingAccountKey !== null) {
    console.log("Restoring existing ACME account...");
    const keyPair =
      await CryptoKeyUtils.importKeyPairFromPemPrivateKey(existingAccountKey);
    account = await client.login({ keyPair });
  } else {
    console.log("Creating new ACME account...");
    account = await client.createAccount({ emails: [ACME_EMAIL] });
    const { privateKey } = await CryptoKeyUtils.exportKeyPairToPem(
      account.keyPair
    );
    await putR2Text("acme-account-key.pem", privateKey);
  }

  console.log(`Requesting certificate for: ${DOMAINS.join(", ")}`);
  const { updateDnsRecords, cleanup } = createDnsUpdater(
    CF_API_TOKEN,
    CF_ZONE_ID
  );

  try {
    const { certificate, certKeyPair } =
      await AcmeWorkflows.requestCertificate({
        acmeAccount: account,
        domains: DOMAINS,
        updateDnsRecords,
        delayAfterDnsRecordsConfirmed: 5000,
        timeout: 30000,
      });

    const { privateKey } = await CryptoKeyUtils.exportKeyPairToPem(certKeyPair);

    await putR2Text(
      "all.pem.json",
      JSON.stringify({ cert: certificate, key: privateKey })
    );

    console.log("Certificate renewed and uploaded to R2.");
  } finally {
    await cleanup();
  }
}

main().catch((e) => {
  console.error("Certificate renewal failed:", e);
  process.exit(1);
});
