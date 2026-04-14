import { describe, expect, it } from "vitest";

describe("task route provider choice", () => {
  it("routes generation to the image provider", async () => {
    let chooseProviderForTaskType:
      | ((taskType: "image_generation" | "background_removal") => string)
      | undefined;

    try {
      ({ chooseProviderForTaskType } = await import(
        "../../src/app/api/tasks/provider-key"
      ));
    } catch {
      chooseProviderForTaskType = undefined;
    }

    if (!chooseProviderForTaskType) {
      throw new Error("chooseProviderForTaskType is not available");
    }

    expect(chooseProviderForTaskType("image_generation")).toBe("openai-image");
    expect(chooseProviderForTaskType("background_removal")).toBe("remove-bg");
  });
});
