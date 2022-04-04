import React from "react";
import {Link, NavLink} from "react-router-dom";
import useAuth from "../app/AuthContext";

function Nav() {
    const {isLoggedIn} = useAuth();

    return (
        <nav>
            <ul>
                {isLoggedIn ?
                    <React.Fragment>
                        <li><NavLink to={"/chats"}>Chats</NavLink></li>
                        <li><Link to={"/logout"}>Log out</Link></li>
                    </React.Fragment> :
                    <li><Link to={"/login"}>Log in</Link></li>
                }
            </ul>
        </nav>
    );
}

export default Nav;
