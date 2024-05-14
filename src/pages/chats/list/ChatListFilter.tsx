import { css } from "@emotion/react";
import { Search } from "iconoir-react";
import React from "react";
import { COLORS, FONT_SIZES } from "../../../common/resources/style-variables";
import { searchInput, searchInputElement } from "../../../components/styles";

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
          <button
            type="button"
            css={searchButton}
            aria-label="Filter chat list"
          >
            <Search
              color={COLORS.DARK_PRIMARY}
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
  border-bottom: 1px solid ${COLORS.LIGHT};
`;

const searchInputForm = css`
  width: 100%;
  font-size: ${FONT_SIZES.M};
  padding: 0.5rem;
  box-sizing: border-box;
  color: ${COLORS.DARK};
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
