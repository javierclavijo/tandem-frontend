import { AxiosError, isAxiosError } from "axios";
import { useCallback, useEffect, useRef } from "react";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { InfiniteData, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Options, default as useWebSocket } from "react-use-websocket";
import { useAllChatsList } from "../pages/chats/queries";
import { ChatMessageResponse, WsChatMessage } from "../pages/chats/types";
import ChatMessageToast from "./components/ChatMessageToast";
import useAuth from "./context/AuthContext/AuthContext";
import { Chat, ServerErrorResponse, UseFormSetErrorName } from "./types";

export const useSetFormErrorOnRequestError = <TData extends FieldValues>(
  setError: UseFormSetError<TData>,
) =>
  useCallback(
    (e: AxiosError<ServerErrorResponse>) => {
      if (isAxiosError(e) && e.response) {
        Object.entries(e.response.data as ServerErrorResponse).forEach(
          ([key, value]) =>
            value.forEach((valueError) =>
              setError(
                key as unknown as UseFormSetErrorName<TData>,
                {
                  type: "focus",
                  // Capitalize the message's first letter before setting it as
                  //the error message
                  message:
                    valueError[0].toUpperCase() + valueError.substring(1),
                },
                {
                  shouldFocus: true,
                },
              ),
            ),
        );
      }
    },
    [setError],
  );

export const useIsDesktop = () =>
  useMediaQuery({ query: "(min-width: 1024px)" });

/**
 * Adds a timeout to a handler callback. Cancels the timeout on component
 * unmount. Should not be used for long timeout which may overlap, as only the
 * last timeout is cancelled.
 *
 * @param handler The handler to be called after the timeout.
 * @param timeout The timeout in ms.
 * @returns The handler function wrapped in setTimeout.
 */
export const useTimeoutHandler = (
  handler: TimerHandler,
  timeout?: number | undefined,
) => {
  const timeoutIdRef = useRef<number>(-1);

  useEffect(
    () => () => {
      clearTimeout(timeoutIdRef.current);
    },
    [],
  );

  const returnHandler = () => {
    timeoutIdRef.current = setTimeout(handler, timeout);
  };

  return returnHandler;
}; /**
 * Holds the WebSocket connection to the server. Closes the connection if the
 * user logs out.
 */
export function useBaseWsChatConnection(options?: Options | undefined) {
  const { isLoggedIn } = useAuth();

  return useWebSocket<WsChatMessage>(
    `${import.meta.env.VITE_WS_URL}/ws/chats/`,
    {
      onClose: () => console.error("Chat socket closed unexpectedly"),
      shouldReconnect: () => true,
      share: true,
      retryOnError: true,
      ...options,
    },
    isLoggedIn,
  );
}

export function useWsChatListener() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: userChatListData } = useAllChatsList();

  /**
   * Updates the chat list and the corresponding chat messages query whenever a
   * message is received (or sent!). Shows a toast notification under certain
   * conditions.
   */
  const onMessage = (wsMessage: MessageEvent<string>) => {
    const { message } = JSON.parse(wsMessage.data) as WsChatMessage;
    const { chat_id } = message;

    if (chat_id == null) {
      return;
    }

    queryClient.setQueryData<Chat[] | undefined>(
      ["chats", "list", "all"],
      (old) => {
        if (old !== undefined) {
          const oldChat = old.find((c) => c.id === chat_id);
          if (oldChat) {
            oldChat.messages = [message];
          }
        }
        return old;
      },
    );

    const chatQueryKey = ["chats", "messages", chat_id];

    // Update the chat's message list, but only if it already exists in cache.
    // Else, React Query won't fetch the chat's messages when the user enters
    // the chat page. (Tested on React Query 3.39.3, may be corrected in newer
    // versions.)
    const isChatFetched = queryClient.getQueryState(chatQueryKey) !== undefined;
    if (isChatFetched) {
      queryClient.setQueryData<InfiniteData<ChatMessageResponse> | undefined>(
        chatQueryKey,
        (old) => {
          if (old !== undefined) {
            // Add the message to the first page, reassign the page in the
            // array so that the bottom-scrolling effect hook is triggered.
            const firstPage = { ...old.pages[0] };
            old.pages[0] = {
              ...firstPage,
              results: [message, ...firstPage.results],
            };
            return old;
          }
        },
      );
    }

    // If the message comes from another user (i.e. it wasn't sent by the app's
    // user and the user is not currently viewing the chat page, show a message
    // toast.
    if (
      location.pathname !== `/chats/${chat_id}` &&
      user?.id !== undefined &&
      message.author.id !== user?.id
    ) {
      const chatImage = userChatListData?.find(
        (chat) => chat.id === chat_id,
      )?.image;

      toast(
        ChatMessageToast({
          chatImage,
          authorName: message.author.username,
          messageContent: message.content,
        }),
        {
          onClick: () => navigate(`/chats/${chat_id}`),
        },
      );
    }
  };

  return useBaseWsChatConnection({ onMessage });
}
