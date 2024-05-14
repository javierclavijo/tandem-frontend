import { Global } from "@emotion/react";
import axios from "axios";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./features/auth/AuthContext";
import LogIn from "./features/auth/LogIn";
import Register from "./features/auth/Register";
import ChatMain from "./features/chats/ChatMain";
import ChatRoom from "./features/chats/room/ChatRoom";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";
import Home from "./features/home/Home";
import PreLogin from "./features/home/PreLogin";
import ChannelInfo from "./features/info/channel/ChannelInfo";
import { UserInfo } from "./features/info/user/UserInfo";
import Search from "./features/search/Search";
import globalStyles from "./styles";

/**
 * Main axios instance used throughout the app.
 */
export const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  withCredentials: true,
  withXSRFToken: true,

  // Names of the CSRF token cookie and header used by Django.
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

const queryClient = new QueryClient({
  // Increase the default stale time to 60 seconds to avoid fetching data too
  // often.
  defaultOptions: { queries: { staleTime: 60000 } },
});

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/chats",
      element: <ChatMain />,
      children: [
        // User and channel info views
        { path: "users/:id", element: <UserInfo /> },
        { path: "channels/:id", element: <ChannelInfo /> },
        // Chat room view
        { path: ":id", element: <ChatRoom /> },
        // Chat list view.
        {
          path: "",
          element: <EmptyChatRoom />,
        },
      ],
    },
    { path: "/search", element: <Search /> },
    { path: "/login", element: <LogIn /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/", element: <PreLogin /> },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <React.StrictMode>
      <Global styles={globalStyles} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
}
