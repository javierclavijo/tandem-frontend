/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import {chatRoomCss, chatRoomHeaderCss} from "./styles";

function EmptyChatRoom() {
    return (
        <div css={css`${chatRoomCss};
          display: none;
          @media (min-width: 1025px) {
            display: flex;
          }
        `}>
            <header css={chatRoomHeaderCss}>
                <h2>
                    Chats
                </h2>
            </header>
            <div css={css`
              padding: 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
            `}>
                <p css={css`
                  margin: 0;
                  color: ${colors.DARK};
                `}>
                    Select a chat...
                </p>
            </div>
        </div>
    );
}

export default EmptyChatRoom;