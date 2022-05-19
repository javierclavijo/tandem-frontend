/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import { ChatLines, Home, Search } from "iconoir-react";
import { colors } from "../styles/variables";

function Tabs() {
  return (
    <nav css={nav}>
      <div css={tab}>
        <ChatLines color={colors.WHITE} width="1.5rem" height="1.5rem" />
      </div>
      <div css={tab}>
        <Home color={colors.WHITE} width="1.5rem" height="1.5rem" />
      </div>
      <div css={tab}>
        <Search color={colors.WHITE} width="1.5rem" height="1.5rem" />
      </div>
    </nav>
  );
}

const nav = css`
  grid-area: tabs;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  background-color: ${colors.PRIMARY};

  @media (min-width: 1025px) {
    display: none;
  }
`;

const tab = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Tabs;
