import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import PortType from "../constants/port-type";
import StoreKey from "../constants/store-key";
import { parseResponseSW } from "../lib/fetch-sw";

interface PortProviderProps {
  children: React.ReactNode;
}

function PortProvider({ children }: PortProviderProps): React.ReactNode {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const port = chrome.runtime.connect(chrome.runtime.id);

    port.onMessage.addListener(async (message) => {
      console.info("popup:", "port.onMessage", message.type);

      switch (message.type) {
        case PortType.UpdatedMessages: {
          const data = await parseResponseSW(PortType.UpdatedMessages, message.data);
          queryClient.setQueryData(StoreKey.Messages, data);
          break;
        }
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  return children;
}

export default PortProvider;
