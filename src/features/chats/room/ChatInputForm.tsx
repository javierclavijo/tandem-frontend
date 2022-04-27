/** @jsxImportSource @emotion/react */

import React, {useCallback, useState} from "react";
import {Chat} from "../../../entities/Chat";
import useWebSocket from "react-use-websocket";
import useAuth from "../../auth/AuthContext";
import {css} from "@emotion/react";
import {colors, textSizes} from "../../../styles/variables";
import {ArrowRightCircled} from "iconoir-react";

function ChatInputForm({chat}: { chat: Chat }) {
    const [inputValue, setInputValue] = useState<string>("");
    const {token} = useAuth();

    const {
        sendJsonMessage,
    } = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/chats/?${token}`, {
        onClose: () => console.error("Chat socket closed unexpectedly"),
        shouldReconnect: () => true,
        share: true
    });

    const handleSend = useCallback((event) => {
        event.preventDefault();
        if (inputValue) {
            const message = {
                chat_id: chat.id,
                content: inputValue,
                chat_type: chat.type
            };
            sendJsonMessage(message);
            setInputValue("");
        }
    }, [chat, inputValue, sendJsonMessage]);

    return (
        <div css={css`
          padding: 1rem;
          box-sizing: border-box;
        `}>
            <form css={css`
              width: 100%;
              background-color: ${colors.LIGHT};
              border-radius: 3px;
              display: flex;
            `}
                  onSubmit={handleSend}>
                <input type="text" id="chat-text-input"
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       placeholder="Write a message"
                       css={css`
                         width: 100%;
                         border: none;
                         background: none;
                         outline: none;
                         padding: 0.5rem;
                         font-size: ${textSizes.M};
                       `}
                />
                <button type="submit" id="chat-send"
                        css={css`
                          background: none;
                          border: none;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        `}>
                    <ArrowRightCircled color={colors.PRIMARY} width="1.5rem" height="1.5rem"/>
                </button>
            </form>
        </div>
    );
}

export default ChatInputForm;