import { z } from "zod";
import MessageData, { messagesSchema } from "../entities/message";
import fetchApi from "../lib/fetch-api";
import ChromeStorageKey from "../constants/chrome-storage-key";

const fetchMessagesSchema = z.object({
  messages: messagesSchema,
});

export async function fetchNewMessages(): Promise<MessageData[]> {
  const data = await fetchApi();
  const result = await fetchMessagesSchema.safeParseAsync(data);

  if (!result.success) {
    throw new Error(`Failed to parse API messages with error: ${result.error.message}.`);
  }

  return result.data.messages;
}

export async function loadFromStorage(): Promise<MessageData[]> {
  const data = await chrome.storage.sync.get(ChromeStorageKey.messages);

  if (!(ChromeStorageKey.messages in data)) {
    return [];
  }

  const result = await fetchMessagesSchema.safeParseAsync(data);

  if (!result.success) {
    throw new Error(`Failed to parse Storage messages with error: ${result.error.message}.`);
  }

  return result.data.messages;
}

export async function markAllReadInStorage(): Promise<MessageData[]> {
  const messages = await loadFromStorage();

  const updatedMessages = messages.map((message) => ({
    ...message,
    read: true,
  }));

  await saveToStorage(updatedMessages);
  return updatedMessages;
}

export async function markReadInStorage(id: string): Promise<MessageData[]> {
  const messages = await loadFromStorage();

  const updatedMessages = messages.map((message) => message.id !== id ? message : {
    ...message,
    read: true,
  });

  await saveToStorage(updatedMessages);
  return updatedMessages;
}

export async function saveToStorage(messages: MessageData[]): Promise<void> {
  await chrome.storage.sync.set({
    messages: messages.map((message) => ({
      ...message,
      timestamp: message.timestamp.toISOString(),
    })),
  });
}

export async function updateUnreadBadge(): Promise<void> {
  const messages = await loadFromStorage();
  const unreadMessages = messages.filter((message) => !message.read);

  if (unreadMessages.length === 0) {
    await chrome.action.setBadgeText({ text: "" });
  } else {
    await chrome.action.setBadgeText({ text: unreadMessages.length.toString() });
  }
}
