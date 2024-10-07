import { type BrowserContext, type Worker, chromium, test as base } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  serviceWorker: Worker;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(path.dirname(fileURLToPath(import.meta.url)), "../dist");

    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        "--headless=new",
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    await use(context);
    await context.close();
  },
  extensionId: async ({ serviceWorker }, use) => {
    const extensionId = serviceWorker.url().split("/")[2] ?? "";
    await use(extensionId);
  },
  serviceWorker: async ({ context }, use) => {
    let [background] = context.serviceWorkers();

    if (typeof background === "undefined") {
      background = await context.waitForEvent("serviceworker");
    }

    await use(background);
  },
});

export const expect = test.expect;
