import { Global } from "@emotion/react";
import axios from "axios";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./pages/auth/AuthContext/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChatsLayout from "./pages/chats/ChatsLayout";
import ChannelPage from "./pages/chats/channels/ChannelPage";
import ChatPage from "./pages/chats/chat/ChatPage";
import EmptyChatPage from "./pages/chats/chat/EmptyChatPage";
import { UserPage } from "./pages/chats/users/UserPage";
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

export const queryClient = new QueryClient({
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
      { path: "users/:id", element: <UserPage /> },
      { path: "channels/:id", element: <ChannelPage /> },
      // Chat room view
      { path: ":id", element: <ChatPage /> },
      // Chat list view.
      {
        path: "",
        element: <EmptyChatPage />,
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
