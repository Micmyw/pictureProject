import { expect, test } from "@playwright/test";

test("background page loads for authenticated users", async ({ page }) => {
  await page.goto("/app/background");
  await expect(
    page.getByRole("heading", { name: "Background cleanup" })
  ).toBeVisible();
});
