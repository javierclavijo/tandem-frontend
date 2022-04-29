/** @jsxImportSource @emotion/react */

import React from "react";
import {Route, Routes} from "react-router-dom";
import LogIn from "./features/auth/LogIn";
import ChatMain from "./features/chats/ChatMain";
import LogOut from "./features/auth/LogOut";
import Home from "./features/home/Home";
import ChatRoom from "./features/chats/room/ChatRoom";
import {Global} from "@emotion/react";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";
import {globalStyles} from "./styles/global";
import {UserInfo} from "./features/info/user/UserInfo";
import ChannelInfo from "./features/info/channel/ChannelInfo";

export default function App() {


    return (
        <React.Fragment>
            <Global styles={globalStyles}/>
            <Routes>
                <Route path="/chats" element={<ChatMain/>}>
                    <Route path="users/:id" element={<UserInfo/>}/>
                    <Route path="channels/:id" element={<ChannelInfo/>}/>
                    <Route path=":id" element={<ChatRoom/>}/>
                    <Route index element={<EmptyChatRoom/>}/>
                </Route>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/logout" element={<LogOut/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </React.Fragment>
    );
}
