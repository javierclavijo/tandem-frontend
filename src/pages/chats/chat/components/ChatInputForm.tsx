import { css } from "@emotion/react";
import useEventListener from "@use-it/event-listener";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";
import { ArrowRightCircle, Emoji } from "iconoir-react";
import React, { CSSProperties, useCallback, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { COLORS, FONT_SIZES } from "../../../../common/constants";
import { useSendWsMessage } from "../../hooks";
import { ChatType } from "../../types";

interface ChatInputFormProps {
  chatId: string;
  chatType: ChatType;
  onMessageSend: () => void;
}

/**
 * Input form for the chat room. Includes the chat message input, a send button
 * and an emoji picker.
 */
const ChatInputForm = ({
  chatId,
  chatType,
  onMessageSend,
}: ChatInputFormProps) => {
  const sendWsMessage = useSendWsMessage();

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
  const handleMessageSend = (
    event:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (inputValue.length !== 0) {
      sendWsMessage(inputValue, chatId, chatType);
      setInputValue("");
      onMessageSend();
    }
  };
  /**
   * Handles key input, sending the message if the user presses the Enter key,
   * but not the Ctrl or Meta key. This allows the user to insert new lines in
   * their message.
   */
  const onKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === "Enter") {
      if (event.metaKey || event.ctrlKey) {
        setInputValue(inputValue.concat("\n"));
      } else {
        handleMessageSend(event);
      }
    }
  };
  /**
   * Toggles the emoji picker's rendering.
   */
  const onShowEmojiPickerClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setShowEmojiPicker((currentValue) => !currentValue);
    event.stopPropagation();
  };
  /**
   * Handles the emoji click event. Appends the emoji to the input's value.
   */
  const onEmojiClick: MouseDownEvent = useCallback(
    (emojiData) => {
      setInputValue(inputValue.concat(emojiData.emoji));
    },
    [inputValue, setInputValue],
  );

  return (
    <div css={container}>
      <form css={form} onSubmit={handleMessageSend}>
        <EmojiPicker
          open={showEmojiPicker}
          onEmojiClick={onEmojiClick}
          emojiStyle={EmojiStyle.NATIVE}
          style={emojiPickerStyle}
          previewConfig={{ showPreview: false }}
        />

        <button
          type="button"
          onClick={onShowEmojiPickerClick}
          id="chat-emoji"
          css={button}
          aria-label="Open emoji picker"
        >
          <Emoji color={`${COLORS.DARK}99`} width="1.5rem" height="1.5rem" />
        </button>

        <TextareaAutosize
          id="chat-text-input"
          name="chat-text-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
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
            color={inputValue ? COLORS.PRIMARY : `${COLORS.DARK}99`}
            width="1.5rem"
            height="1.5rem"
          />
        </button>
      </form>
    </div>
  );
};

const container = css`
  padding: 1rem;
  box-sizing: border-box;
`;

const form = css`
  width: 100%;
  background-color: ${COLORS.LIGHT};
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
  font-size: ${FONT_SIZES.M};
`;

const button = css`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const emojiPickerStyle: CSSProperties = {
  position: "absolute",
  bottom: "100%",
  marginBottom: "1rem",
};

export default ChatInputForm;
