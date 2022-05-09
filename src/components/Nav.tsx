/** @jsxImportSource @emotion/react */

import React from "react";
import {NavLink} from "react-router-dom";
import useAuth from "../features/auth/AuthContext";
import {css} from "@emotion/react";
import {colors, textSizes} from "../styles/variables";
import {useMediaQuery} from "react-responsive";

const defaultImg = require("../static/images/user_placeholder.png");

function Nav() {

    const {user, isLoggedIn} = useAuth();
    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    return (
        <header css={header}>
            <nav css={nav}>
                <h1 css={title}>ChatApp</h1>
                <ul css={navList}>
                    {isLoggedIn && isDesktop ?
                        <React.Fragment>
                            <li><NavLink to={"/chats"} css={linkCss}>Chats</NavLink></li>
                            <li><NavLink to={`/chats/users/${user?.id}`} css={linkCss}>{user?.username}</NavLink></li>
                            <li><NavLink to={"/search"} css={linkCss}>Search</NavLink></li>
                            <li><NavLink to={"/logout"} css={linkCss}>Log out</NavLink></li>
                            <li>
                                <div css={imageContainer}>
                                    <img src={user?.image ?? defaultImg} alt={user?.username}
                                         css={userImage}
                                    />
                                </div>
                            </li>
                        </React.Fragment> :
                        <React.Fragment>
                            <li><NavLink to={"/login"} css={linkCss}>Log in</NavLink></li>
                            <li><NavLink to={"/register"} css={linkCss}>Sign in</NavLink></li>
                        </React.Fragment>
                    }
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

const linkCss = css`
  text-decoration: none;
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
`;

const userImage = css`
  height: 100%;
  width: 100%;
  object-fit: cover;
  flex: 1 0 auto;
`;

const imageContainer = css`
  height: 3rem;
  width: 3rem;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
`;


export default Nav;
