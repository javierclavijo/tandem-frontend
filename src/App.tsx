/** @jsxImportSource @emotion/react */

import React from "react";
import { Route, Routes } from "react-router-dom";
import LogIn from "./features/auth/LogIn";
import ChatMain from "./features/chats/ChatMain";
import Home from "./features/home/Home";
import ChatRoom from "./features/chats/room/ChatRoom";
import { Global } from "@emotion/react";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";
import { globalStyles } from "./styles/global";
import { UserInfo } from "./features/info/user/UserInfo";
import ChannelInfo from "./features/info/channel/ChannelInfo";
import { useMediaQuery } from "react-responsive";
import ChatList from "./features/chats/list/ChatList";
import Search from "./features/search/Search";
import Register from "./features/auth/Register";

export default function App() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <React.Fragment>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/chats" element={<ChatMain />}>
          {/* User and channel info views */}
          <Route path="users/:id" element={<UserInfo />} />
          <Route path="channels/:id" element={<ChannelInfo />} />

          {/* Chat room view */}
          <Route path=":id" element={<ChatRoom />} />

          {/* Chat list view. If the viewport has desktop dimensions, render the empty chat room view, as the
                    chat list is displayed outside the router's outlet. */}
          <Route index element={isDesktop ? <EmptyChatRoom /> : <ChatList />} />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </React.Fragment>
  );
}
