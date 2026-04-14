import { describe, expect, it } from "vitest";
import { getProvider } from "../../src/lib/ai/provider-registry";

describe("provider registry", () => {
  it("returns the requested provider", () => {
    expect(getProvider("mock").key).toBe("mock");
  });

  it("throws on missing provider", () => {
    expect(() => getProvider("missing")).toThrow("Unknown provider");
  });
});
