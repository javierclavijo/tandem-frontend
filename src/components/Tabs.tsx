/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { ChatLines, Home, Search } from "iconoir-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { colors } from "../styles/variables";

/**
 * Renders a nav element with tabs to the app's main sections. Only renders in the mobile layout.
 */
function Tabs() {
  return (
    <nav css={nav}>
      <div css={tab}>
        <NavLink
          to="/chats"
          style={({ isActive }) => (isActive ? activeLink : link)}
        >
          <ChatLines color={colors.WHITE} width="1.5rem" height="1.5rem" />
        </NavLink>
      </div>
      <div css={tab}>
        <NavLink
          to="/home"
          style={({ isActive }) => (isActive ? activeLink : link)}
        >
          <Home color={colors.WHITE} width="1.5rem" height="1.5rem" />
        </NavLink>
      </div>
      <div css={tab}>
        <NavLink
          to="/search"
          style={({ isActive }) => (isActive ? activeLink : link)}
        >
          <Search color={colors.WHITE} width="1.5rem" height="1.5rem" />
        </NavLink>
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

  @media (min-width: 1024px) {
    display: none;
  }
`;

const tab = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s;

  &:hover {
    background-color: ${colors.DARK_PRIMARY}60;
  }
`;

const link = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const activeLink = {
  ...link,
  backgroundColor: colors.DARK_PRIMARY,
};

export default Tabs;
