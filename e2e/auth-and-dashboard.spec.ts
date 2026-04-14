import { expect, test } from "@playwright/test";

test("marketing home loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /generate product images/i })
  ).toBeVisible();
});
