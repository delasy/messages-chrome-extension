import React from "react";
import MessageData from "../entities/message";
import Priority from "../constants/priority";
import cn from "../lib/cn";
import { useReadMessage, useReadAllMessagesPending } from "../store/message";

interface MessageProps {
  message: MessageData;
}

function Message({ message }: MessageProps): React.ReactNode {
  const readMessage = useReadMessage();
  const readAllMessagesPending = useReadAllMessagesPending();
  let readContent;

  if (readMessage.isError) {
    readContent = (
      <p className="font-sans font-normal text-xs/tight text-red-400">
        An error occurred. {readMessage.error.message}
      </p>
    );
  } else if ((!message.read && readAllMessagesPending) || readMessage.isPending) {
    readContent = (
      <p className="font-sans font-normal text-xs/tight text-gray-400">
        Loading...
      </p>
    );
  } else if (!message.read) {
    readContent = (
      <button
        className="font-sans font-normal text-xs/tight text-blue-500 underline"
        onClick={() => readMessage.mutate(message.id)}
      >
        Mark as read
      </button>
    );
  } else {
    readContent = null;
  }

  const className = cn(
    "flex flex-col items-start rounded-xl p-2 gap-1",
    "bg-white border-2 border-gallery",
    "dark:bg-cod dark:border-mine",
    {
      "opacity-50": message.read,
    }
  );

  const contentClassName = cn(
    "font-sans font-normal text-base/tight",
    {
      "text-red-700": message.priority === Priority.High,
      "text-yellow-700": message.priority === Priority.Medium,
      "text-black dark:text-white": message.priority === Priority.Low,
    },
  );

  return (
    <div className={className}>
      <div className="flex justify-between w-full">
        <p className="font-sans font-normal text-xs/tight text-gray-400 text-left">
          {message.timestamp.toLocaleString()}
        </p>
        {readContent}
      </div>
      <p className={contentClassName}>
        {message.content}
      </p>
    </div>
  );
}

export default Message;
