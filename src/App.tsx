import { Global } from "@emotion/react";
import axios from "axios";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./pages/auth/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChatsLayout from "./pages/chats/ChatsLayout";
import ChannelInfo from "./pages/chats/channels/ChannelInfo";
import ChatRoom from "./pages/chats/chat/ChatRoom";
import EmptyChatRoom from "./pages/chats/chat/EmptyChatRoom";
import { UserInfo } from "./pages/chats/users/UserInfo";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import { default as PreLoginPage } from "./pages/pre-login/PreLoginPage";
import SearchPage from "./pages/search/SearchPage";
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

const router = createBrowserRouter([
  {
    path: "/chats",
    element: <ChatsLayout />,
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
  { path: "/search", element: <SearchPage /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/register", element: <RegisterPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/", element: <PreLoginPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default function App() {
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
