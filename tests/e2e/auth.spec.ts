import { test, expect } from "@playwright/test";
import {
  autoAdminLogin,
  logout,
  signInWithCredentials,
  TestUser,
} from "./helper";

test.describe("Authentication Flow", () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should login with valid credentials", async ({ page }) => {
    await autoAdminLogin(page);
  });

  test("should handle invalid login", async ({ page }) => {
    await signInWithCredentials(
      page,
      TestUser.invalid.email,
      TestUser.invalid.password
    );
    await expect(page.getByText(/login failed/i)).toBeVisible();
  });

  test("should logout", async ({ page }) => {
    await autoAdminLogin(page);
    await logout(page);
    await expect(page.getByText("test123@gmail.com").first()).not.toBeVisible();
  });
});
