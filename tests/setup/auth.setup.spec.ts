import { test as setup } from "@playwright/test";

const authFile = "tests/e2e/.auth/user.json";

setup.describe("Auth Setup", () => {
  setup("authenticate", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL as string);
    await page
      .getByLabel(/password/i)
      .fill(process.env.TEST_USER_PASSWORD as string);

    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("/");

    await page.context().storageState({ path: authFile });
  });
});
