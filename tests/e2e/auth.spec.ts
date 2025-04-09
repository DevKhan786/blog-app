import { test, expect } from "@playwright/test";

test.describe("Authentication Flow with navigation", () => {
  test.beforeEach("Navigate to login page before each", async ({ page }) => {
    await page.goto("/login");
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.getByRole("button", { name: "Auto-fill" }).click();
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("/", { timeout: 15000 });

    await expect(page.getByText("test123@gmail.com").first()).toBeVisible();
  });

  test("should handle invalid login", async ({ page }) => {
    await page.context().clearCookies();

    await page.getByLabel("Email").fill("invalid@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});

test.describe("Auth flow without navigation", () => {
  test("should logout successfully", async ({ page }) => {
    await page.getByRole("button", { name: /logout/i, exact: true }).click();
    await expect(page).toHaveURL("/");
    await page.goto("/login");
    await expect(page.getByRole("link", { name: /login/i })).toBeVisible();
  });

  test("should show user profile", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("test123@gmail.com")).toBeVisible();
  });
});
