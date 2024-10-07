import React from "react";
import {
  useReadAllMessages,
  useReadMessagePending,
  useUnreadMessagesCount,
} from "../store/message";

function Header() {
  const readAllMessages = useReadAllMessages();
  const readMessagePending = useReadMessagePending();
  const unreadMessages = useUnreadMessagesCount();
  let readAllContent;

  if (readAllMessages.isError) {
    readAllContent = (
      <p className="font-sans text-sm/tight font-normal text-red-400">
        An error occurred.
      </p>
    );
  } else if (readMessagePending || readAllMessages.isPending) {
    readAllContent = (
      <p className="font-sans text-sm/tight font-normal text-gray-400">
        Loading...
      </p>
    );
  } else if (unreadMessages > 0) {
    readAllContent = (
      <button
        className="font-sans text-sm/tight font-normal text-blue-500 underline"
        onClick={() => readAllMessages.mutate()}
      >
        Mark all as read
      </button>
    );
  } else {
    readAllContent = null;
  }

  return (
    <div className="flex justify-between items-center">
      <h1 className="font-sans text-xl/tight font-medium text-black dark:text-white">
        System Messages
      </h1>
      {readAllContent !== null && (
        <div className="relative" data-testid="read-all">
          {readAllContent}
        </div>
      )}
    </div>
  );
}

export default Header;
