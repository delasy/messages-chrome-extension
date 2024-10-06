import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PortProvider from "./PortProvider";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps): React.ReactNode {
  return (
    <QueryClientProvider client={queryClient}>
      <PortProvider>
        {children}
      </PortProvider>
    </QueryClientProvider>
  );
}

export default Providers;
