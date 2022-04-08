/** @jsxImportSource @emotion/react */

import React from "react";
import {Link, NavLink} from "react-router-dom";
import useAuth from "../app/AuthContext";
import {jsx, css} from "@emotion/react";

function Nav() {
    const {isLoggedIn} = useAuth();

    const colors = {
        PRIMARY: "#2E96BF",
        SECONDARY: "#8DD9F7",
        LIGHT: "#EDF6FA",
        DARK: "#333333",
        WHITE: "#FFFFFF",
    };

    const textSizes = {
        S: "0.875rem",
        M: "1rem",
        L: "1.5rem",
        XL: "2rem",
    };

    const navCss = css`
      background: ${colors.PRIMARY};
      display: flex;
      justify-content: space-between;
      padding: 20px 50px;
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

    return (
        <nav css={navCss}>
            <h1 css={h1Css}>ChatApp</h1>
            <ul css={ulCss}>
                {isLoggedIn ?
                    <React.Fragment>
                        <li><NavLink to={"/chats"} css={linkCss}>Chats</NavLink></li>
                        <li><Link to={"/logout"} css={linkCss}>Log out</Link></li>
                    </React.Fragment> :
                    <li><Link to={"/login"} css={linkCss}>Log in</Link></li>
                }
            </ul>
        </nav>
    );
}

export default Nav;
