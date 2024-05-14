import { css } from "@emotion/react";
import useEventListener from "@use-it/event-listener";
import Picker, { EmojiStyle } from "emoji-picker-react";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";
import { ArrowRightCircle, Emoji } from "iconoir-react";
import React, { CSSProperties, useCallback, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useWebSocket from "react-use-websocket";
import { colors, textSizes } from "../../../styles/variables";
import useAuth from "../../auth/AuthContext";
import { Chat } from "../../common/types";

/**
 * Input form for the chat room. Includes the chat message input, a send button
 * and an emoji picker.
 */
function ChatInputForm({ chat }: { chat: Chat }) {
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

  /**
   * Message input text area ref.
   */
  const elementRef = React.useRef<HTMLTextAreaElement | null>(null);

  /**
   * Controls the value of the input field.
   */
  const [inputValue, setInputValue] = useState<string>("");

  /**
   * Controls whether the emoji picker is rendered.
   */
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  /**
   * Close the emoji picker when the 'Esc' key is pressed.
   */
  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.code === "Escape" && showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  });

  /**
   * Close the emoji picker when the user clicks outside it.
   */
  useEventListener("click", (event: MouseEvent) => {
    const emojiPicker = document.querySelector(".emoji-picker-react");
    if (
      event.target instanceof Element &&
      !emojiPicker?.contains(event.target) &&
      showEmojiPicker
    ) {
      setShowEmojiPicker(false);
    }
  });

  /**
   * Handles sending messages.
   */
  const handleSend = useCallback(
    (
      event:
        | React.KeyboardEvent<HTMLTextAreaElement>
        | React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
      if (inputValue) {
        const message = {
          type: "chat_message",
          chat_id: chat.id,
          content: inputValue,
          chat_type: chat.type,
        };
        sendJsonMessage(message);
        setInputValue("");
      }
    },
    [chat, inputValue, sendJsonMessage],
  );

  /**
   * Handles the emoji click event. Appends the emoji to the input's value.
   */
  const onEmojiClick: MouseDownEvent = React.useCallback(
    (emojiData) => {
      setInputValue(inputValue.concat(emojiData.emoji));
    },
    [inputValue, setInputValue],
  );

  /**
   * Handles key input, sending the message if the user presses the Enter key,
   * but not the Ctrl or Meta key. This allows the user to insert new lines in
   * their message.
   */
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.code === "Enter") {
      if (event.metaKey || event.ctrlKey) {
        setInputValue(inputValue.concat("\n"));
      } else {
        handleSend(event);
      }
    }
  };

  /**
   * Toggles the emoji picker's rendering.
   */
  const toggleEmojiPicker = React.useCallback(() => {
    setShowEmojiPicker(!showEmojiPicker);
  }, [showEmojiPicker, setShowEmojiPicker]);

  /**
   * Styles for the emoji picker.
   */
  const emojiPickerStyle: CSSProperties = {
    position: "absolute",
    bottom: "100%",
    display: showEmojiPicker ? "flex" : "none",
    marginBottom: "1rem",
  };

  return (
    <div css={container}>
      <form css={form} onSubmit={handleSend}>
        <Picker
          onEmojiClick={onEmojiClick}
          emojiStyle={EmojiStyle.NATIVE}
          style={emojiPickerStyle}
        />
        <button
          type="button"
          onClick={toggleEmojiPicker}
          id="chat-emoji"
          css={button}
          aria-label="Open emoji picker"
        >
          <Emoji color={`${colors.DARK}99`} width="1.5rem" height="1.5rem" />
        </button>

        <TextareaAutosize
          id="chat-text-input"
          name="chat-text-input"
          ref={elementRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          minRows={1}
          maxRows={12}
          css={input}
          placeholder="Write a message (press Ctrl + Enter to insert a new line)"
          aria-label="Chat message text area"
        />
        <button
          type="submit"
          id="chat-send"
          css={button}
          aria-label="Send message"
          aria-disabled={!inputValue}
        >
          <ArrowRightCircle
            color={inputValue ? colors.PRIMARY : `${colors.DARK}99`}
            width="1.5rem"
            height="1.5rem"
          />
        </button>
      </form>
    </div>
  );
}
const container = css`
  padding: 1rem;
  box-sizing: border-box;
`;

const form = css`
  width: 100%;
  background-color: ${colors.LIGHT};
  border-radius: 3px;
  display: flex;
  position: relative;
  padding: 0 0.5rem;
  box-sizing: border-box;
`;

const input = css`
  width: 100%;
  border: none;
  background: none;
  outline: none;
  padding: 0.5rem;
  box-sizing: border-box;
  resize: none;
  font-size: ${textSizes.M};
`;

const button = css`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export default ChatInputForm;
