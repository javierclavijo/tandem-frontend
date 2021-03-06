/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { ChatLines, Home, LogOut, Search } from "iconoir-react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/AuthContext";
import { infoButton } from "../../features/info/styles";
import langflowLogo from "../../static/svg/langflow_logo.svg";
import { colors, textSizes } from "../../styles/variables";
import NavProfilePicture from "./NavProfilePicture";

/**
 * Main header component. Renders differently according to the viewport width and to whether the user is logged in.
 */
function Nav() {
  const { user, isLoggedIn, logout } = useAuth();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const navigate = useNavigate();

  /**
   * Handler for logout action.
   */
  const handleLogout = React.useCallback(async () => {
    await logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <header css={header}>
      <nav css={nav} role="navigation">
        <Link to="/" css={titleLink}>
          <img src={langflowLogo} alt="Logo" css={logo} />
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
                  <button
                    type="button"
                    onClick={handleLogout}
                    css={logoutButton}
                  >
                    <LogOut
                      color={colors.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Log out
                  </button>
                </li>
              </React.Fragment>
            ) : (
              // Post-login mobile header
              <React.Fragment>
                <li>
                  <NavProfilePicture user={user} />
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    css={logoutButton}
                  >
                    <LogOut
                      color={colors.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Log out
                  </button>
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

const logo = css`
  max-height: 3rem;
`;

const title = css`
  color: ${colors.WHITE};
  margin: 0;
  font-size: ${textSizes.L};

  @media (min-width: 576px) {
    font-size: ${textSizes.XL};
  }
`;

const navList = css`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style-type: none;
  gap: 0.25rem;

  @media (min-width: 576px) {
    gap: 2rem;
  }
`;

export const link = css`
  ${infoButton};
  text-decoration: none;
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
  text-align: center;
`;

export const titleLink = css`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const activeNavLink = {
  borderBottom: `2px solid ${colors.SECONDARY}`,
};

const logoutButton = css`
  ${infoButton};
  font-size: ${textSizes.S};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 576px) {
    flex-direction: row;
    font-size: ${textSizes.M};
  }
`;

export default Nav;
