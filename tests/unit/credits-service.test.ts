import { describe, expect, it } from "vitest";

describe("credit services", () => {
  it("summarizes ledger amounts into granted, used, and balance totals", async () => {
    let summarizeLedgerAmounts:
      | ((amounts: number[]) => {
          balance: number;
          totalGranted: number;
          totalUsed: number;
        })
      | undefined;

    try {
      ({ summarizeLedgerAmounts } = await import(
        "../../src/lib/credits/credits-service"
      ));
    } catch {
      summarizeLedgerAmounts = undefined;
    }

    if (!summarizeLedgerAmounts) {
      throw new Error("summarizeLedgerAmounts is not available");
    }

    expect(summarizeLedgerAmounts([40, -1, -2, 10])).toEqual({
      totalGranted: 50,
      totalUsed: 3,
      balance: 47
    });
  });

  it("converts a successful task charge into a negative ledger entry", async () => {
    let buildCreditChargeAmount:
      | ((amount: number) => number)
      | undefined;

    try {
      ({ buildCreditChargeAmount } = await import(
        "../../src/lib/tasks/task-service"
      ));
    } catch {
      buildCreditChargeAmount = undefined;
    }

    if (!buildCreditChargeAmount) {
      throw new Error("buildCreditChargeAmount is not available");
    }

    expect(buildCreditChargeAmount(3)).toBe(-3);
  });
});
