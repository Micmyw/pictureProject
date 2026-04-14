import { describe, expect, it } from "vitest";

describe("admin credit payload", () => {
  it("creates a positive manual adjustment record", async () => {
    let buildCreditEntry:
      | ((workspaceId: string, amount: number) => {
          amount: number;
          entry_kind: string;
          workspace_id: string;
        })
      | undefined;

    try {
      ({ buildCreditEntry } = await import(
        "../../src/app/api/admin/credits/payload"
      ));
    } catch {
      buildCreditEntry = undefined;
    }

    if (!buildCreditEntry) {
      throw new Error("buildCreditEntry is not available");
    }

    expect(buildCreditEntry("workspace-1", 25)).toEqual({
      workspace_id: "workspace-1",
      entry_kind: "manual_adjustment",
      amount: 25
    });
  });
});
