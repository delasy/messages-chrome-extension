import React from "react";
import Message from "./Message";
import { useMessages } from "../store/message";

function Messages(): React.ReactNode {
  const { data: messages, isError, isPending } = useMessages();
  let content;

  if (isError) {
    content = (
      <p className="font-sans font-normal text-xs/tight text-red-400">
        An error occurred.
      </p>
    );
  } else if (isPending) {
    content = (
      <p className="font-sans font-normal text-xs/tight text-gray-400">
        Loading...
      </p>
    );
  } else if (messages.length === 0) {
    content = (
      <p className="font-sans font-normal text-xs/tight text-gray-400">
        No messages yet.
      </p>
    );
  } else {
    content = messages.map((message) => (
      <Message key={message.id} message={message} />
    ));
  }

  return (
    <div className="h-full relative overflow-y-auto">
      <div className="flex flex-col gap-1 pb-2" data-testid="messages">
        {content}
      </div>
    </div>
  );
}

export default Messages;
