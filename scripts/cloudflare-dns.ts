const CF_API_BASE = "https://api.cloudflare.com/client/v4/zones";

function stripTrailingDot(name: string): string {
  return name.endsWith(".") ? name.slice(0, -1) : name;
}

function headers(apiToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
}

export async function createDnsTxtRecords(
  apiToken: string,
  zoneId: string,
  records: Array<{ name: string; content: string }>
): Promise<string[]> {
  const ids: string[] = [];
  for (const record of records) {
    const resp = await fetch(`${CF_API_BASE}/${zoneId}/dns_records`, {
      method: "POST",
      headers: headers(apiToken),
      body: JSON.stringify({
        type: "TXT",
        name: stripTrailingDot(record.name),
        content: record.content,
      }),
    });
    const data: { success: boolean; result?: { id: string }; errors?: { code: number; message: string }[] } =
      await resp.json();
    if (!data.success) {
      const msg = data.errors?.map((e) => e.message).join(", ") ?? "unknown error";
      throw new Error(`Failed to create DNS TXT record: ${msg}`);
    }
    ids.push(data.result!.id);
  }
  return ids;
}

export async function deleteDnsTxtRecords(
  apiToken: string,
  zoneId: string,
  recordIds: string[]
): Promise<void> {
  for (const id of recordIds) {
    const resp = await fetch(`${CF_API_BASE}/${zoneId}/dns_records/${id}`, {
      method: "DELETE",
      headers: headers(apiToken),
    });
    const data: { success: boolean; errors?: { code: number; message: string }[] } =
      await resp.json();
    if (!data.success) {
      const msg = data.errors?.map((e) => e.message).join(", ") ?? "unknown error";
      throw new Error(`Failed to delete DNS TXT record ${id}: ${msg}`);
    }
  }
}

export function createDnsUpdater(
  apiToken: string,
  zoneId: string
): {
  updateDnsRecords: (records: Array<{ name: string; type: string; content: string }>) => Promise<void>;
  cleanup: () => Promise<void>;
} {
  let createdIds: string[] = [];

  return {
    async updateDnsRecords(records) {
      const ids = await createDnsTxtRecords(
        apiToken,
        zoneId,
        records.map((r) => ({ name: r.name, content: r.content }))
      );
      createdIds.push(...ids);
    },
    async cleanup() {
      if (createdIds.length === 0) return;
      const idsToDelete = createdIds;
      createdIds = [];
      await deleteDnsTxtRecords(apiToken, zoneId, idsToDelete);
    },
  };
}
