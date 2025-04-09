import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.use({ storageState: "tests/e2e/.auth/user.json" });

  test("should login and show profile", async ({ page }) => {
    await page.goto("/");

    const profileButton = page.getByRole("button", { name: /profile/i });
    await expect(profileButton).toBeVisible();

    await profileButton.click();
    await expect(page).toHaveURL(/profile/);

    await expect(page.getByText(process.env.TEST_USER_EMAIL!)).toBeVisible();
  });

  test("should show error for invalid login", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("wrong@email.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});
