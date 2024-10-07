import { test, expect } from "./fixtures";
import PortType from "../constants/port-type";

test.beforeEach(async ({ extensionId, page }) => {
  const messages = [
    {
      id: "1",
      content: "Lorem ipsum dolor sit amet",
      priority: "high",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      priority: "low",
      timestamp: new Date().toISOString(),
      read: false,
    },
  ];

  await page.addInitScript(({ PortType, messages }) => {
    chrome.runtime.sendMessage = async ({ type, data }) => {
      if (type === PortType.ReadMessage && typeof data === "string") {
        const message = messages.find((message) => message.id === data);

        if (typeof message !== "undefined") {
          message.read = true;
        }
      } else if (type === PortType.ReadAllMessages) {
        messages.forEach((message) => {
          message.read = true;
        });
      }

      return Promise.resolve(messages);
    };
  }, { PortType, messages });

  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);
});

test.describe("Popup Messages", () => {
  test("shows and simultaneously marks messages read", async ({ page }) => {
    const firstMessage = page.getByTestId("message").nth(0);
    const secondMessage = page.getByTestId("message").nth(1);
    const firstMessageRead = firstMessage.getByTestId("read");
    const secondMessageRead = secondMessage.getByTestId("read");
    const readAll = page.getByTestId("read-all");

    await secondMessageRead.click();

    await Promise.all([
      expect(firstMessageRead).toHaveText("Mark as read"),
      expect(secondMessageRead).toHaveText("Loading..."),
      expect(readAll).toHaveText("Loading..."),
    ]);

    await Promise.all([
      expect(secondMessage).toHaveClass(/opacity-50/),
      expect(secondMessageRead).not.toBeAttached(),
      expect(readAll).toHaveText("Mark all as read"),
    ]);

    await firstMessageRead.click();

    await Promise.all([
      expect(firstMessageRead).toHaveText("Loading..."),
      expect(readAll).toHaveText("Loading..."),
    ]);

    await Promise.all([
      expect(firstMessage).toHaveClass(/opacity-50/),
      expect(firstMessageRead).not.toBeAttached(),
      expect(readAll).not.toBeAttached(),
    ]);
  });

  test("shows and concurrently marks messages read", async ({ page }) => {
    const firstMessage = page.getByTestId("message").nth(0);
    const secondMessage = page.getByTestId("message").nth(1);
    const firstMessageRead = firstMessage.getByTestId("read");
    const secondMessageRead = secondMessage.getByTestId("read");
    const readAll = page.getByTestId("read-all");

    await Promise.all([
      secondMessageRead.click(),
      firstMessageRead.click(),
    ]);

    await Promise.all([
      expect(firstMessageRead).toHaveText("Loading..."),
      expect(secondMessageRead).toHaveText("Loading..."),
      expect(readAll).toHaveText("Loading..."),
    ]);

    await Promise.all([
      expect(firstMessage).toHaveClass(/opacity-50/),
      expect(secondMessage).toHaveClass(/opacity-50/),
      expect(firstMessageRead).not.toBeAttached(),
      expect(secondMessageRead).not.toBeAttached(),
      expect(readAll).not.toBeAttached(),
    ]);
  });

  test("reads all messages", async ({ page }) => {
    const firstMessage = page.getByTestId("message").nth(0);
    const secondMessage = page.getByTestId("message").nth(1);
    const firstMessageRead = firstMessage.getByTestId("read");
    const secondMessageRead = secondMessage.getByTestId("read");
    const readAll = page.getByTestId("read-all");

    await readAll.click();

    await Promise.all([
      expect(firstMessageRead).toHaveText("Loading..."),
      expect(secondMessageRead).toHaveText("Loading..."),
      expect(readAll).toHaveText("Loading..."),
    ]);

    await Promise.all([
      expect(firstMessage).toHaveClass(/opacity-50/),
      expect(secondMessage).toHaveClass(/opacity-50/),
      expect(firstMessageRead).not.toBeAttached(),
      expect(secondMessageRead).not.toBeAttached(),
      expect(readAll).not.toBeAttached(),
    ]);
  });
});
