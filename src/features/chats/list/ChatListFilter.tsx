/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import { Search } from "iconoir-react";
import { colors, textSizes } from "../../../styles/variables";
import { searchInput, searchInputElement } from "../../../styles/components";
import { visuallyHidden } from "../../../styles/layout";

/**
 * Chat list filter form.
 */
function ChatListFilter({
  setFilter,
}: {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div css={outerContainer}>
      <div css={innerContainer}>
        <form css={searchInputForm}>
          <input
            type="text"
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            id="chat-list-filter"
            css={searchInputElement}
            aria-label="Chat list filter"
          />
          <button type="button" css={searchButton} aria-label="Filter chat list">
            <Search
              color={colors.DARK_PRIMARY}
              width="1.5rem"
              height="1.5rem"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

const innerContainer = css`
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.LIGHT};
`;

const searchInputForm = css`
  width: 100%;
  font-size: ${textSizes.M};
  padding: 0.5rem;
  box-sizing: border-box;
  color: ${colors.DARK};
  background: none;
  border-radius: 3px;
  border: none;

  &:focus {
    outline: none;
  }
  ${searchInput}
`;

const searchButton = css`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const outerContainer = css`
  padding: 1rem;
`;

export default ChatListFilter;
