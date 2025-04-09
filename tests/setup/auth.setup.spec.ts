import { chromium } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`${process.env.BASE_URL}/login`);

    await page.getByLabel("Email").fill(process.env.TEST_USER_EMAIL!);
    await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL(`${process.env.BASE_URL}/`);

    await page.context().storageState({
      path: path.resolve(__dirname, "../../tests/e2e/.auth/user.json"),
    });
  } finally {
    await browser.close();
  }
}

export default globalSetup;
