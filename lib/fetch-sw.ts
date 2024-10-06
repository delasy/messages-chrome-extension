import delay from "./delay";
import { schemaMap } from "../entities/message";

export async function parseResponseSW<K extends keyof typeof schemaMap>(type: K, data: any) {
  const result = await schemaMap[type].output.safeParseAsync(data);

  if (!result.success) {
    throw new Error(`Failed to parse ServiceWorker response: ${result.error.message}.`);
  }

  return result.data;
}

export async function fetchSW<K extends keyof typeof schemaMap>(type: K, data?: any) {
  console.info("popup:", "fetchSW", type);

  await delay(1000);
  const res = await chrome.runtime.sendMessage({ type, data });
  return parseResponseSW(type, res);
}
