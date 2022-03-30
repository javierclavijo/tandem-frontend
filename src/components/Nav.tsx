import React from "react";
import {Link, NavLink} from "react-router-dom";

function Nav({token}: { token: string }) {


    return (
        <nav>
            <ul>
                {/* If user has an auth token, show logout link. Else, show login link. */}
                {token ?
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
