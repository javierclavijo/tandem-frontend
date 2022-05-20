/** @jsxImportSource @emotion/react */

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../features/auth/AuthContext";
import { css } from "@emotion/react";
import { colors, textSizes } from "../styles/variables";
import { useMediaQuery } from "react-responsive";
import {
  buttonWithoutBackgroundAndBorder,
  thumbnailContainer,
  thumbnailImg,
} from "../styles/components";

const defaultImg = require("../static/images/user_placeholder.png");

function Nav() {
  const { user, isLoggedIn, logout } = useAuth();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const navigate = useNavigate();

  const handleLogout = React.useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <header css={header}>
      <nav css={nav}>
        <h1 css={title}>ChatApp</h1>
        <ul css={navList}>
          {isLoggedIn && isDesktop ? (
            <React.Fragment>
              <li>
                <NavLink to={"/chats"} css={link}>
                  Chats
                </NavLink>
              </li>
              <li>
                <NavLink to={`/chats/users/${user?.id}`} css={link}>
                  {user?.username}
                </NavLink>
              </li>
              <li>
                <NavLink to={"/search"} css={link}>
                  Search
                </NavLink>
              </li>
              <li>
                <button type="button" onClick={handleLogout} css={logoutButton}>
                  Log out
                </button>
              </li>
              <li>
                <div css={imageContainer}>
                  <img
                    src={user?.image ?? defaultImg}
                    alt={user?.username}
                    css={pictureImg}
                  />
                </div>
              </li>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li>
                <NavLink to={"/login"} css={link}>
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink to={"/register"} css={link}>
                  Sign in
                </NavLink>
              </li>
              <li>
                <button type="button" onClick={handleLogout} css={logoutButton}>
                  Log out
                </button>
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
  background: ${colors.PRIMARY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3.125rem;
  box-sizing: border-box;
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

const link = css`
  text-decoration: none;
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
`;

const pictureImg = css`
  ${thumbnailImg};
  flex: 1 0 auto;
`;

const imageContainer = css`
  ${thumbnailContainer};
  flex: 1 0 auto;
`;

const logoutButton = css`
  ${buttonWithoutBackgroundAndBorder};
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
`;

export default Nav;
