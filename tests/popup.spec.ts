import { test, expect } from "./fixtures";

test.beforeEach(async ({ extensionId, page }) => {
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);
});

test.describe("Popup", () => {
  test("has heading", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("System Messages");
  });

  test("shows loading text", async ({ page }) => {
    await expect(page.getByText("Loading...")).toBeVisible();
  });

  test("shows no messages text", async ({ page }) => {
    await expect(page.getByText("No messages yet.")).toBeVisible();
  });

  test("loads first message", async ({ page }) => {
    await expect(page.getByTestId("message")).toBeVisible({ timeout: 60_000 });
  });
});
