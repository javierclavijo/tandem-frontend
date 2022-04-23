/** @jsxImportSource @emotion/react */

import React from "react";
import {Link, NavLink} from "react-router-dom";
import useAuth from "../../features/auth/AuthContext";
import {h1Css, headerCss, linkCss, navCss, ulCss} from "./styles";


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
                            <li><NavLink to={"/chats/profile"} css={linkCss}>{user?.username}</NavLink></li>
                            <li><Link to={"/logout"} css={linkCss}>Log out</Link></li>
                        </React.Fragment> :
                        <li><Link to={"/login"} css={linkCss}>Log in</Link></li>
                    }
                </ul>
            </nav>
        </header>
    );
}

export default Nav;
