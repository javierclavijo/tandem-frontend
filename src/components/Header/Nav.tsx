/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { ChatLines, Home, Search } from "iconoir-react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/AuthContext";
import { infoButton } from "../../features/info/styles";
import { colors, textSizes } from "../../styles/variables";
import LogoutButton from "./LogoutButton";
import NavProfilePicture from "./NavProfilePicture";

function Nav() {
  const { user, isLoggedIn, logout } = useAuth();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const navigate = useNavigate();

  const handleLogout = React.useCallback(async () => {
    await logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <header css={header}>
      <nav css={nav}>
        <Link to="/" css={titleLink}>
          <h1 css={title}>LangFlow</h1>
        </Link>
        <ul css={navList}>
          {isLoggedIn ? (
            isDesktop ? (
              // Post-login desktop header
              <React.Fragment>
                <li>
                  <NavLink
                    to={"/"}
                    css={link}
                    style={({ isActive }) => (isActive ? activeNavLink : {})}
                  >
                    <Home color={colors.WHITE} width="1.5rem" height="1.5rem" />
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/chats"}
                    css={link}
                    style={({ isActive }) => (isActive ? activeNavLink : {})}
                    end
                  >
                    <ChatLines
                      color={colors.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Chats
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/search"}
                    css={link}
                    style={({ isActive }) => (isActive ? activeNavLink : {})}
                  >
                    <Search
                      color={colors.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Search
                  </NavLink>
                </li>
                <li>
                  <NavProfilePicture user={user} />
                </li>
                <li>
                  <LogoutButton handleLogout={handleLogout} />
                </li>
              </React.Fragment>
            ) : (
              // Post-login mobile header
              <React.Fragment>
                <li>
                  <NavProfilePicture user={user} />
                </li>
                <li>
                  <LogoutButton handleLogout={handleLogout} />
                </li>
              </React.Fragment>
            )
          ) : (
            // Pre-login header
            <React.Fragment>
              <li>
                <NavLink
                  to={"/login"}
                  css={link}
                  style={({ isActive }) => (isActive ? activeNavLink : {})}
                >
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/register"}
                  css={link}
                  style={({ isActive }) => (isActive ? activeNavLink : {})}
                >
                  Sign in
                </NavLink>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
}

const header = css`
  grid-area: header;
  height: 100%;
`;

const nav = css`
  height: 100%;
  background: ${colors.DARK_PRIMARY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding: 0 3.125rem;
  }
`;

const title = css`
  color: ${colors.WHITE};
  margin: 0;
  font-size: ${textSizes.XL};
`;

const navList = css`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style-type: none;
  gap: 20px;
`;

export const link = css`
  ${infoButton};
  text-decoration: none;
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
`;

export const titleLink = css`
  text-decoration: none;
`;

export const activeNavLink = {
  borderBottom: `2px solid ${colors.SECONDARY}`,
};

export default Nav;
