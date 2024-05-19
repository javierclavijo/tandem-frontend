import { css } from "@emotion/react";
import { ChatLines, Home, Search } from "iconoir-react";
import { NavLink } from "react-router-dom";
import { COLORS, FONT_SIZES } from "../constants";

/**
 * Renders a nav element with tabs to the app's main sections. Only renders in
 * the mobile layout.
 */
const Tabs = () => (
  <nav role="navigation" css={nav}>
    <ul css={ul}>
      <li css={tab}>
        <NavLink
          to="/chats"
          style={({ isActive }) => (isActive ? activeLink : link)}
          css={additionalLinkStyles}
        >
          <ChatLines color={COLORS.WHITE} width="1.5rem" height="1.5rem" />
          Chats
        </NavLink>
      </li>
      <li css={tab}>
        <NavLink
          to="/home"
          style={({ isActive }) => (isActive ? activeLink : link)}
          css={additionalLinkStyles}
        >
          <Home color={COLORS.WHITE} width="1.5rem" height="1.5rem" />
          Home
        </NavLink>
      </li>
      <li css={tab}>
        <NavLink
          to="/search"
          style={({ isActive }) => (isActive ? activeLink : link)}
          css={additionalLinkStyles}
        >
          <Search color={COLORS.WHITE} width="1.5rem" height="1.5rem" />
          Search
        </NavLink>
      </li>
    </ul>
  </nav>
);

const nav = css`
  grid-area: tabs;
  width: 100%;
  height: 100%;
  padding: 0;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const ul = css`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-evenly;
  background-color: ${COLORS.PRIMARY};
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
    background-color: ${COLORS.DARK_PRIMARY}60;
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
  fontSize: FONT_SIZES.S,
  color: COLORS.WHITE,
};

const activeLink = {
  ...link,
  backgroundColor: COLORS.DARK_PRIMARY,
};

const additionalLinkStyles = css`
  &:visited {
    color: ${COLORS.WHITE};
  }
`;

export default Tabs;
