import { DateTime } from "luxon";
import {
  default as React,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { InfiniteData, useQueryClient } from "react-query";
import { useOutletContext } from "react-router-dom";
import useWebSocket, { Options } from "react-use-websocket";
import useAuth from "../../common/context/AuthContext/AuthContext";
import { Chat, FriendChat, User } from "../../common/types";
import {
  ChatHeaderData,
  ChatMessage,
  ChatMessageResponse,
  ChatType,
  WsChatMessage,
} from "./types";

/**
 * Sorts messages or chats according to sent datetime. If the message is undefined (usually due to a chat having
 * no messages, which shouldn't happen in practice), the current datetime is used.
 */
export const messageSortFn = (
  a: ChatMessage | undefined,
  b: ChatMessage | undefined,
) => {
  const aDateTime = a?.timestamp
    ? DateTime.fromISO(a.timestamp)
    : DateTime.now();
  const bDateTime = b?.timestamp
    ? DateTime.fromISO(b.timestamp)
    : DateTime.now();

  if (aDateTime > bDateTime) {
    return -1;
  } else if (bDateTime > aDateTime) {
    return 1;
  } else {
    return 0;
  }
};

export const getFriendFromFriendChat = (user: User, chat: FriendChat) =>
  chat.users.find((u: User) => u.id !== user.id);

export const useSetChatHeader = () => {
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderData | null,
        React.Dispatch<React.SetStateAction<ChatHeaderData | null>>,
      ]
    >();

  return setHeader;
};

/**
 * Sets the chat header according to the current view's resource's data. Used in ChatRoom component.
 */
export const useSetChatRoomHeader = (chat: Chat | undefined | null) => {
  const { user } = useAuth();
  const setHeader = useSetChatHeader();

  return useEffect(() => {
    if (chat) {
      let headerProps: ChatHeaderData;
      if (chat.type === "users") {
        const friend = getFriendFromFriendChat(user!, chat as FriendChat);
        headerProps = {
          link: `/chats/users/${friend?.id}`,
          title: friend?.username,
          image: friend?.image,
        };
      } else {
        headerProps = {
          link: `/chats/channels/${chat.id}`,
          title: chat.name,
          image: chat.image,
        };
      }
      setHeader(headerProps);
    }
  }, [chat, setHeader, user]);
};

/**
 * Holds the WebSocket connection to the server. Closes the connection if the
 * user logs out.
 */
function useBaseWsChatConnection(options?: Options | undefined) {
  const { isLoggedIn } = useAuth();

  return useWebSocket<WsChatMessage>(
    `${import.meta.env.VITE_WS_URL}/ws/chats/`,
    {
      onClose: () => console.error("Chat socket closed unexpectedly"),
      shouldReconnect: () => true,
      share: true,
      ...options,
    },
    isLoggedIn,
  );
}

export function useWsChatListener() {
  const queryClient = useQueryClient();

  /**
   * Updates the chat list and the corresponding chat messages query whenever a
   * message is received or sent.
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

    queryClient.setQueryData<InfiniteData<ChatMessageResponse> | undefined>(
      ["chats", "messages", chat_id],
      (old) => {
        if (old !== undefined) {
          // Add the message to the first page, reassign the page in the
          // array so that the bottom-scrolling effect hook is triggered.
          const firstPage = { ...old.pages[0] };
          old.pages[0] = {
            ...firstPage,
            results: [message, ...firstPage.results],
          };
        }
        return old;
      },
    );
  };

  return useBaseWsChatConnection({ onMessage });
}

export function useJoinWsChat() {
  const { sendJsonMessage } = useBaseWsChatConnection();

  return useCallback(
    (id: string) => {
      const message = {
        chat_id: id,
        type: "join_chat",
      };
      sendJsonMessage(message);
    },
    [sendJsonMessage],
  );
}

export function useSendWsMessage() {
  const { sendJsonMessage } = useBaseWsChatConnection();

  return useCallback(
    (content: string, chatId: string, chatType: ChatType) => {
      const message = {
        type: "chat_message",
        chat_id: chatId,
        content,
        chat_type: chatType,
      };
      sendJsonMessage(message);
    },
    [sendJsonMessage],
  );
}

interface UseEditType<T> {
  editEnabled: boolean;
  setEditEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  clearError: () => void;
  elementRef: React.MutableRefObject<T | null>;
  submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
  handleChange: (e: React.ChangeEvent<T>) => void;
  handleFocus: () => void;
  handleCancel: () => void;
}
/**
 * Holds state and functionality to update a user or channel's name or description.
 */
export function useEditField<
  T extends HTMLInputElement | HTMLTextAreaElement,
  S,
>(data: S | undefined, dataKey: keyof S): UseEditType<T> {
  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const elementRef = useRef<T>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const clearError = useCallback(() => {
    if (error) {
      setError("");
    }
  }, [error]);

  const updateInputValue = useCallback(() => {
    const dataValue = data?.[dataKey];
    if (dataValue && typeof dataValue === "string") {
      setValue(dataValue);
    }
  }, [data, dataKey]);

  // Set data on init and whenever data changes (i.e. after submitting)
  useEffect(updateInputValue, [data?.[dataKey], updateInputValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<T>) => {
      clearError();
      setValue(e.target.value);
    },
    [clearError],
  );

  const handleFocus = useCallback(() => {
    setEditEnabled(true);
    clearError();
  }, [clearError]);

  const handleCancel = useCallback(() => {
    updateInputValue();
    setEditEnabled(false);
  }, [updateInputValue]);

  return useMemo(
    () => ({
      editEnabled,
      setEditEnabled,
      value,
      setValue,
      error,
      setError,
      clearError,
      elementRef,
      submitButtonRef,
      handleChange,
      handleFocus,
      handleCancel,
    }),
    [
      editEnabled,
      setEditEnabled,
      value,
      setValue,
      error,
      setError,
      clearError,
      elementRef,
      submitButtonRef,
      handleChange,
      handleFocus,
      handleCancel,
    ],
  );
}
