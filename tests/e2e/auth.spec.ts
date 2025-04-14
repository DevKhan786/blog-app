// tests/auth.spec.ts
import { test, expect } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";
import { TestUser } from "../config/test-data";

test.describe("Authentication Flow", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.navigateToLogin();
  });

  test("should login with admin credentials automatically", async () => {
    await authPage.autoAdminLogin();
    await authPage.assertSuccessfulLogin();
  });

  test("should login with admin credentials manually", async () => {
    await authPage.signInWithCredentials(
      TestUser.admin.email,
      TestUser.admin.password
    );
    await authPage.assertSuccessfulLogin();
  });

  test("should handle invalid login", async () => {
    await authPage.signInWithCredentials(
      TestUser.invalid.email,
      TestUser.invalid.password
    );
    await authPage.assertLoginError(/login failed/i);
  });

  test("should logout successfully", async () => {
    await authPage.autoAdminLogin();
    await authPage.logout();
    await authPage.assertSuccessfulLogout();
  });
});
