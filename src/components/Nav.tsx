/** @jsxImportSource @emotion/react */

import React from "react";
import {Link, NavLink} from "react-router-dom";
import useAuth from "../features/auth/AuthContext";
import {css} from "@emotion/react";
import {colors, textSizes} from "../styles/variables";


function Nav() {
    const {user, isLoggedIn} = useAuth();

    return (
        <header css={headerCss}>
            <nav css={navCss}>
                <h1 css={h1Css}>ChatApp</h1>
                <ul css={ulCss}>
                    {isLoggedIn ?
                        <React.Fragment>
                            <li><NavLink to={"/chats"} css={linkCss}>Chats</NavLink></li>
                            <li><NavLink to={`/chats/users/${user?.id}`} css={linkCss}>{user?.username}</NavLink></li>
                            <li><Link to={"/logout"} css={linkCss}>Log out</Link></li>
                        </React.Fragment> :
                        <li><Link to={"/login"} css={linkCss}>Log in</Link></li>
                    }
                </ul>
            </nav>
        </header>
    );
}


const headerCss = css`
  grid-area: header;
  height: 100%;
`;

const navCss = css`
  height: 100%;
  background: ${colors.PRIMARY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3.125rem;
  box-sizing: border-box;
`;

const h1Css = css`
  color: ${colors.WHITE};
  margin: 0;
  font-size: ${textSizes.XL};
`;

const ulCss = css`
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


export default Nav;
