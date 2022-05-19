/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import { Search } from "iconoir-react";
import { colors, textSizes } from "../../../styles/variables";

function ChatListFilter({
  setFilter,
}: {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div
      css={css`
        padding: 1rem;
      `}
    >
      <div css={container}>
        <form css={form}>
          <input
            type="text"
            css={searchInput}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
          />
          <button type="button" css={searchButton}>
            <Search color={colors.PRIMARY} width="1.5rem" height="1.5rem" />
          </button>
        </form>
      </div>
    </div>
  );
}

const container = css`
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.LIGHT};
`;

const form = css`
  background-color: ${colors.LIGHT};
  display: flex;
  border-radius: 3px;
`;

const searchInput = css`
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
`;

const searchButton = css`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ChatListFilter;
