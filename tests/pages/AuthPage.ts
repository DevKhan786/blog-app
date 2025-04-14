// pages/AuthPage.ts
import { Page, expect } from "@playwright/test";

export class AuthPage {
  constructor(private readonly page: Page) {}

  async navigateToLogin() {
    await this.page.goto("/login");
    await expect(this.page).toHaveURL("/login");
  }

  async autoAdminLogin() {
    await this.page.getByRole("button", { name: "Auto-fill" }).click();
    await this.submitForm();
    await this.assertSuccessfulLogin();
  }

  async signInWithCredentials(email: string, password: string) {
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);
    await this.submitForm();
  }

  async logout() {
    await this.page.getByRole("button", { name: /logout/i }).click();
  }

  async assertSuccessfulLogin() {
    await expect(this.page).toHaveURL("/");
    await expect(
      this.page.getByText("test123@gmail.com").first()
    ).toBeVisible();
  }

  async assertLoginError(errorMessage: RegExp) {
    await expect(this.page.getByText(errorMessage)).toBeVisible();
  }

  async assertSuccessfulLogout() {
    await expect(this.page).toHaveURL("/");
    await expect(
      this.page.getByText("test123@gmail.com").first()
    ).not.toBeVisible();
  }

  private async submitForm() {
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }
}
