/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { ChatLines, Home, Search } from "iconoir-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { colors, textSizes } from "../styles/variables";

/**
 * Renders a nav element with tabs to the app's main sections. Only renders in the mobile layout.
 */
function Tabs() {
  return (
    <nav role="navigation" css={nav}>
      <ul css={ul}>
        <li css={tab}>
          <NavLink
            to="/chats"
            style={({ isActive }) => (isActive ? activeLink : link)}
            css={additionalLinkStyles}
          >
            <ChatLines color={colors.WHITE} width="1.5rem" height="1.5rem" />
            Chats
          </NavLink>
        </li>
        <li css={tab}>
          <NavLink
            to="/home"
            style={({ isActive }) => (isActive ? activeLink : link)}
            css={additionalLinkStyles}
          >
            <Home color={colors.WHITE} width="1.5rem" height="1.5rem" />
            Home
          </NavLink>
        </li>
        <li css={tab}>
          <NavLink
            to="/search"
            style={({ isActive }) => (isActive ? activeLink : link)}
            css={additionalLinkStyles}
          >
            <Search color={colors.WHITE} width="1.5rem" height="1.5rem" />
            Search
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

const nav = css`
  grid-area: tabs;
  width: 100%;
  height: 100%;
  padding: 0;
`;

const ul = css`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-evenly;
  background-color: ${colors.PRIMARY};
  padding: 0;
  list-style-type: none;

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
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
  fontSize: textSizes.S,
  color: colors.WHITE,
};

const activeLink = {
  ...link,
  backgroundColor: colors.DARK_PRIMARY,
};

const additionalLinkStyles = css`
  &:visited {
    color: ${colors.WHITE};
  }
`;

export default Tabs;
