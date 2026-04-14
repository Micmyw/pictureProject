export type CreateTaskType = "image_generation" | "background_removal";

export function chooseProviderForTaskType(taskType: CreateTaskType) {
  return taskType === "image_generation" ? "openai-image" : "remove-bg";
}
