/** @jsxImportSource @emotion/react */

import React from "react";
import {Route, Routes} from "react-router-dom";
import LogIn from "./features/auth/LogIn";
import ChatList from "./features/chats/list/ChatList";
import LogOut from "./features/auth/LogOut";
import Home from "./features/home/Home";
import ChatRoom from "./features/chats/room/ChatRoom";
import {Global} from "@emotion/react";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";
import ChatInfo from "./features/info/ChatInfo";
import {globalStyles} from "./styles/global";
import {OwnUserInfo} from "./features/info/user/UserInfo";

export default function App() {


    return (
        <React.Fragment>
            <Global styles={globalStyles}/>
            <Routes>
                <Route path="/chats" element={<ChatList/>}>
                    <Route path=":id/info" element={<ChatInfo/>}/>
                    <Route path=":id" element={<ChatRoom/>}/>
                    <Route path="profile" element={<OwnUserInfo/>}/>
                    <Route index element={<EmptyChatRoom/>}/>
                </Route>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/logout" element={<LogOut/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </React.Fragment>
    );
}
