import { expect, test } from "@playwright/test";

test("background page redirects unauthenticated users to sign in", async ({ page }) => {
  await page.goto("/app/background");
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
