import { Page, expect } from "@playwright/test";
import { waitFor } from "@testing-library/dom";

export const autoAdminLogin = async (page: Page) => {
  await expect(page, "Should navigate to login page").toHaveURL("/login");
  await page.getByRole("button", { name: "Auto-fill" }).click();
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page, "Should redirect to home page").toHaveURL("/");
  await expect(page.getByText("test123@gmail.com").first()).toBeVisible();
};

export const logout = async (page: Page) => {
  await page.getByRole("button", { name: /logout/i }).click();
  await expect(page, "Should redirect to home page").toHaveURL("/");
};

export const signInWithCredentials = async (
  page: Page,
  email: string,
  password: string
) => {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
};

export const TestUser = {
  admin: { email: "test123@gmail.com", password: "test123" },
  invalid: { email: "invalid@example.com", password: "wrongpassword" },
};
