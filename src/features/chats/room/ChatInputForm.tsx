/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { ArrowRightCircled, Emoji } from "iconoir-react";
import React, { useCallback, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Chat } from "../../../entities/Chat";
import { colors, textSizes } from "../../../styles/variables";
import useAuth from "../../auth/AuthContext";
import Picker from "emoji-picker-react";

function ChatInputForm({ chat }: { chat: Chat }) {
  const [inputValue, setInputValue] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();

  const { sendJsonMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/ws/chats/`,
    {
      onClose: () => console.error("Chat socket closed unexpectedly"),
      shouldReconnect: () => true,
      share: true,
    },
    isLoggedIn
  );

  const handleSend = useCallback(
    (event) => {
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
    [chat, inputValue, sendJsonMessage]
  );

  const onEmojiClick = React.useCallback(
    (event, emojiObject) => {
      setInputValue(inputValue.concat(emojiObject.emoji));
    },
    [inputValue, setInputValue]
  );

  const toggleEmojiPicker = React.useCallback(() => {
    setShowEmojiPicker(!showEmojiPicker);
  }, [showEmojiPicker, setShowEmojiPicker]);

  const emojiPickerStyle = {
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
          native={true}
          pickerStyle={emojiPickerStyle}
        />
        <button
          type="button"
          onClick={toggleEmojiPicker}
          id="chat-emoji"
          css={button}
        >
          <Emoji color={`${colors.DARK}99`} width="1.5rem" height="1.5rem" />
        </button>
        <input
          type="text"
          id="chat-text-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Write a message"
          css={input}
        />
        <button type="submit" id="chat-send" css={button}>
          <ArrowRightCircled
            color={colors.PRIMARY}
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
