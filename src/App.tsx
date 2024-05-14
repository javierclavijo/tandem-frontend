import { Global } from "@emotion/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useMediaQuery } from "react-responsive";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./features/auth/AuthContext";
import LogIn from "./features/auth/LogIn";
import Register from "./features/auth/Register";
import ChatMain from "./features/chats/ChatMain";
import ChatList from "./features/chats/list/ChatList";
import ChatRoom from "./features/chats/room/ChatRoom";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";
import Home from "./features/home/Home";
import PreLogin from "./features/home/PreLogin";
import ChannelInfo from "./features/info/channel/ChannelInfo";
import { UserInfo } from "./features/info/user/UserInfo";
import Search from "./features/search/Search";
import globalStyles from "./styles";

const queryClient = new QueryClient({
  // Increase the default stale time to 60 seconds to avoid fetching data too
  // often.
  defaultOptions: { queries: { staleTime: 60000 } },
});

export default function App() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
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
                <Route
                  index
                  element={isDesktop ? <EmptyChatRoom /> : <ChatList />}
                />
              </Route>
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<PreLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
