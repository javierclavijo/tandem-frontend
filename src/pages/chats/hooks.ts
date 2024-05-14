import { DateTime } from "luxon";
import {
  default as React,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOutletContext } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { Chat, FriendChat, User } from "../../common/types";
import { ChatHeaderProps } from "../../components/ChatHeader";
import useAuth from "../auth/AuthContext/AuthContext";
import { ChatMessage } from "./types";

/**
 * Sorts messages or chats according to sent datetime. If the message is undefined (usually due to a chat having
 * no messages, which shouldn't happen in practice), the current datetime is used.
 */
// TODO: move this stuff to its own module.
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

/**
 * Sets the chat header according to the current view's resource's data. Used in ChatRoom component.
 */
export const useSetChatRoomHeader = (chat: Chat | undefined | null) => {
  const { user } = useAuth();
  const [, setHeader] =
    useOutletContext<
      [
        ChatHeaderProps | null,
        React.Dispatch<React.SetStateAction<ChatHeaderProps | null>>,
      ]
    >();

  return useEffect(() => {
    if (chat) {
      let headerProps: ChatHeaderProps;
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
 * Sends a message through the WS connection when a chat is created to join the chat group.
 * The connection is closed if the user logs out.
 */
export function useJoinWSChat() {
  const { isLoggedIn } = useAuth();

  const { sendJsonMessage } = useWebSocket(
    `${import.meta.env.VITE_WS_URL}/ws/chats/`,
    {
      onClose: () => console.error("Chat socket closed unexpectedly"),
      shouldReconnect: () => true,
      share: true,
    },
    isLoggedIn,
  );

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
// TODO: probably remove this altogether, substitute with RHF.

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
