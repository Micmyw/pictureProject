import { describe, expect, it } from "vitest";

describe("task runner asset persistence", () => {
  it("maps task types to the correct asset kind", async () => {
    let getAssetKindForTaskType:
      | ((
          taskType: "image_generation" | "background_removal" | "background_replacement"
        ) => "generated" | "processed")
      | undefined;

    try {
      ({ getAssetKindForTaskType } = await import(
        "../../src/lib/ai/task-runner"
      ));
    } catch {
      getAssetKindForTaskType = undefined;
    }

    if (!getAssetKindForTaskType) {
      throw new Error("getAssetKindForTaskType is not available");
    }

    expect(getAssetKindForTaskType("image_generation")).toBe("generated");
    expect(getAssetKindForTaskType("background_removal")).toBe("processed");
  });
});
