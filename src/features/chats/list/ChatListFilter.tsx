/** @jsxImportSource @emotion/react */

import React from "react";
import {searchFormCss, searchInputCss} from "./styles";
import {css} from "@emotion/react";

function ChatListFilter({setFilter}: { setFilter: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <div css={css`
          padding-right: 1rem;
        `}>
            <form css={searchFormCss}>
                <input type="text"
                       css={searchInputCss}
                       onChange={(e) => setFilter(e.target.value)}
                       placeholder="Search..."
                />
            </form>
        </div>
    );
}

export default ChatListFilter;