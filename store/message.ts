import { useMutation, useMutationState, useQuery, useQueryClient } from "@tanstack/react-query";
import PortType from "../constants/port-type";
import StoreKey from "../constants/store-key";
import { fetchSW } from "../lib/fetch-sw";

export function useReadAllMessages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: StoreKey.ReadAllMessages,
    mutationFn: () => fetchSW(PortType.ReadAllMessages),
    onSuccess: (data) => queryClient.setQueryData(StoreKey.Messages, data),
  });
}

export function useReadMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: StoreKey.ReadMessage,
    mutationFn: (id: string) => fetchSW(PortType.ReadMessage, id),
    onSuccess: (data) => queryClient.setQueryData(StoreKey.Messages, data),
  });
}

export function useMessages() {
  return useQuery({
    queryKey: StoreKey.Messages,
    queryFn: () => fetchSW(PortType.GetMessages),
    refetchOnWindowFocus: false,
  });
}

export function useReadAllMessagesPending() {
  const statuses = useMutationState({
    filters: {
      mutationKey: StoreKey.ReadAllMessages,
    },
    select: (mutation) => mutation.state.status,
  });

  return statuses.length !== 0 && statuses.some((status) => status === "pending");
}

export function useReadMessagePending() {
  const statuses = useMutationState({
    filters: {
      mutationKey: StoreKey.ReadMessage,
    },
    select: (mutation) => mutation.state.status,
  });

  return statuses.length !== 0 && statuses.some((status) => status === "pending");
}

export function useUnreadMessagesCount() {
  const { data: messages } = useMessages();
  return (messages ?? []).filter((message) => !message.read).length;
}
