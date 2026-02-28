import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createDnsTxtRecords,
  deleteDnsTxtRecords,
  createDnsUpdater,
} from "../scripts/cloudflare-dns";

const API_TOKEN = "test-api-token";
const ZONE_ID = "test-zone-id";
const BASE_URL = "https://api.cloudflare.com/client/v4/zones";

describe("createDnsTxtRecords", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates TXT records and returns their IDs", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: true, result: { id: "rec-1" } }),
        { status: 200 }
      )
    ).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: true, result: { id: "rec-2" } }),
        { status: 200 }
      )
    );

    const ids = await createDnsTxtRecords(API_TOKEN, ZONE_ID, [
      { name: "_acme-challenge.example.com.", content: "token-1" },
      { name: "_acme-challenge.example.com.", content: "token-2" },
    ]);

    expect(ids).toEqual(["rec-1", "rec-2"]);
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    for (const [url, init] of fetchSpy.mock.calls) {
      expect(url).toBe(`${BASE_URL}/${ZONE_ID}/dns_records`);
      expect((init as RequestInit).method).toBe("POST");
      expect((init as RequestInit).headers).toEqual({
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      });
    }

    const body0 = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body0).toEqual({
      type: "TXT",
      name: "_acme-challenge.example.com",
      content: "token-1",
    });

    const body1 = JSON.parse((fetchSpy.mock.calls[1][1] as RequestInit).body as string);
    expect(body1).toEqual({
      type: "TXT",
      name: "_acme-challenge.example.com",
      content: "token-2",
    });
  });

  it("strips trailing dot from name", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: true, result: { id: "rec-1" } }),
        { status: 200 }
      )
    );

    await createDnsTxtRecords(API_TOKEN, ZONE_ID, [
      { name: "_acme-challenge.example.com.", content: "token" },
    ]);

    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.name).toBe("_acme-challenge.example.com");
  });

  it("handles name without trailing dot", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: true, result: { id: "rec-1" } }),
        { status: 200 }
      )
    );

    await createDnsTxtRecords(API_TOKEN, ZONE_ID, [
      { name: "_acme-challenge.example.com", content: "token" },
    ]);

    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.name).toBe("_acme-challenge.example.com");
  });

  it("throws on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          errors: [{ code: 1000, message: "Invalid API token" }],
        }),
        { status: 403 }
      )
    );

    await expect(
      createDnsTxtRecords(API_TOKEN, ZONE_ID, [
        { name: "_acme-challenge.example.com.", content: "token" },
      ])
    ).rejects.toThrow("Failed to create DNS TXT record");
  });

  it("returns empty array for empty input", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const ids = await createDnsTxtRecords(API_TOKEN, ZONE_ID, []);
    expect(ids).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("deleteDnsTxtRecords", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deletes records by ID", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      );

    await deleteDnsTxtRecords(API_TOKEN, ZONE_ID, ["rec-1", "rec-2"]);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0][0]).toBe(
      `${BASE_URL}/${ZONE_ID}/dns_records/rec-1`
    );
    expect(fetchSpy.mock.calls[1][0]).toBe(
      `${BASE_URL}/${ZONE_ID}/dns_records/rec-2`
    );
    for (const [, init] of fetchSpy.mock.calls) {
      expect((init as RequestInit).method).toBe("DELETE");
      expect((init as RequestInit).headers).toEqual({
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      });
    }
  });

  it("throws on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          errors: [{ code: 1000, message: "Not found" }],
        }),
        { status: 404 }
      )
    );

    await expect(
      deleteDnsTxtRecords(API_TOKEN, ZONE_ID, ["rec-1"])
    ).rejects.toThrow("Failed to delete DNS TXT record");
  });

  it("does nothing for empty array", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await deleteDnsTxtRecords(API_TOKEN, ZONE_ID, []);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("createDnsUpdater", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("updateDnsRecords creates records and cleanup deletes them", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, result: { id: "rec-1" } }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, result: { id: "rec-2" } }),
          { status: 200 }
        )
      );

    const { updateDnsRecords, cleanup } = createDnsUpdater(API_TOKEN, ZONE_ID);

    await updateDnsRecords([
      { name: "_acme-challenge.example.com.", type: "TXT", content: "token-1" },
      { name: "_acme-challenge.example.com.", type: "TXT", content: "token-2" },
    ]);

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      );

    await cleanup();

    expect(fetchSpy).toHaveBeenCalledTimes(4);
    expect(fetchSpy.mock.calls[2][0]).toBe(
      `${BASE_URL}/${ZONE_ID}/dns_records/rec-1`
    );
    expect(fetchSpy.mock.calls[3][0]).toBe(
      `${BASE_URL}/${ZONE_ID}/dns_records/rec-2`
    );
  });

  it("cleanup is idempotent when called multiple times", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, result: { id: "rec-1" } }),
          { status: 200 }
        )
      );

    const { updateDnsRecords, cleanup } = createDnsUpdater(API_TOKEN, ZONE_ID);
    await updateDnsRecords([
      { name: "_acme-challenge.example.com.", type: "TXT", content: "token" },
    ]);

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );

    await cleanup();
    await cleanup();

    // DELETE should only be called once (second cleanup is a no-op)
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("accumulates records across multiple updateDnsRecords calls", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, result: { id: "rec-1" } }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, result: { id: "rec-2" } }),
          { status: 200 }
        )
      );

    const { updateDnsRecords, cleanup } = createDnsUpdater(API_TOKEN, ZONE_ID);

    await updateDnsRecords([
      { name: "_acme-challenge.a.com.", type: "TXT", content: "t1" },
    ]);
    await updateDnsRecords([
      { name: "_acme-challenge.b.com.", type: "TXT", content: "t2" },
    ]);

    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      );

    await cleanup();

    expect(fetchSpy).toHaveBeenCalledTimes(4);
    expect(fetchSpy.mock.calls[2][0]).toBe(
      `${BASE_URL}/${ZONE_ID}/dns_records/rec-1`
    );
    expect(fetchSpy.mock.calls[3][0]).toBe(
      `${BASE_URL}/${ZONE_ID}/dns_records/rec-2`
    );
  });

  it("cleanup does nothing when updateDnsRecords was never called", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { cleanup } = createDnsUpdater(API_TOKEN, ZONE_ID);
    await cleanup();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
