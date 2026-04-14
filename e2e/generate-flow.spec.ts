import { expect, test } from "@playwright/test";

test("generate page loads for authenticated users", async ({ page }) => {
  await page.goto("/app/generate");
  await expect(
    page.getByRole("heading", { name: "Generate image" })
  ).toBeVisible();
});
