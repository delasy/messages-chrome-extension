import { z } from "zod";
import PortType from "../constants/port-type";
import Priority from "../constants/priority";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  priority: z.nativeEnum(Priority),
  timestamp: z.coerce.date(),
  read: z.boolean(),
});

export const messagesSchema = z.array(messageSchema);

type MessageData = z.infer<typeof messageSchema>;

export const schemaMap = {
  [PortType.GetMessages]: {
    input: z.void(),
    output: messagesSchema,
  },
  [PortType.ReadAllMessages]: {
    input: z.void(),
    output: messagesSchema,
  },
  [PortType.ReadMessage]: {
    input: z.string(),
    output: messagesSchema,
  },
  [PortType.UpdatedMessages]: {
    input: z.void(),
    output: messagesSchema,
  },
} as const;

export default MessageData;
