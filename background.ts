import Alarm from "./constants/alarm";
import MessageData, { schemaMap } from "./entities/message";
import PortType from "./constants/port-type";
import {
  fetchNewMessages,
  loadFromStorage,
  markAllReadInStorage,
  markReadInStorage,
  saveToStorage,
  updateUnreadBadge,
} from "./use-cases/message";

interface ServiceWorkerMessage {
  type: PortType;
  data: MessageData[];
}

let messagesPort: chrome.runtime.Port | null = null;

function postMessage(message: ServiceWorkerMessage) {
  if (messagesPort === null) {
    return;
  }

  messagesPort.postMessage(message);
}

async function handleMessagesAlarm() {
  const newMessages = await fetchNewMessages();

  if (newMessages.length === 0) {
    return;
  }

  const existingMessages = await loadFromStorage();
  const messages = [...newMessages, ...existingMessages];

  await saveToStorage(messages);
  await updateUnreadBadge();

  postMessage({ type: PortType.UpdatedMessages, data: messages });
}

async function createMessagesAlarm() {
  const alarm = await chrome.alarms.get(Alarm.Messages);

  if (typeof alarm === "undefined") {
    await chrome.alarms.create(Alarm.Messages, { periodInMinutes: 0.5 });
    await handleMessagesAlarm();
  }
}

void createMessagesAlarm();
void updateUnreadBadge();

chrome.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case Alarm.Messages: {
      await handleMessagesAlarm();
      break;
    }
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (messagesPort !== null) {
    return;
  }

  messagesPort = port;

  port.onDisconnect.addListener(() => {
    messagesPort = null;
  });
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  console.info("sw:", "chrome.runtime.onMessage", message.type);
  const respond = sendResponse as (message: MessageData[]) => void;

  switch (message.type) {
    case PortType.GetMessages: {
      (async () => {
        const messages = await loadFromStorage();
        respond(messages);
      })();

      return true;
    }
    case PortType.ReadAllMessages: {
      (async () => {
        const messages = await markAllReadInStorage();
        respond(messages);
        await updateUnreadBadge();
      })();

      return true;
    }
    case PortType.ReadMessage: {
      (async () => {
        const result = await schemaMap[PortType.ReadMessage].input.safeParseAsync(message.data);

        if (!result.success) {
          throw new Error(`Received malformed popup message: ${result.error.message}.`);
        }

        const messages = await markReadInStorage(result.data);
        respond(messages);
        await updateUnreadBadge();
      })();

      return true;
    }
  }

  return false;
});
