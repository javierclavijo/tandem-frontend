import { Global } from "@emotion/react";
import React from "react";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { queryClient } from "./common/apis";
import {
  redirectToHomeIfLoggedIn,
  redirectToLoginIfNotLoggedIn,
} from "./common/loaders";
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

export const router = createBrowserRouter([
  {
    path: "",
    element: <AppWrapper />,
    children: [
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
        loader: redirectToLoginIfNotLoggedIn,
      },
      {
        path: "/search",
        element: <SearchPage />,
        loader: redirectToLoginIfNotLoggedIn,
      },
      {
        path: "/home",
        element: <HomePage />,
        loader: redirectToLoginIfNotLoggedIn,
      },
      {
        path: "/auth/login",
        element: <LoginPage />,
        loader: redirectToHomeIfLoggedIn,
      },
      {
        path: "/auth/register",
        element: <RegisterPage />,
        loader: redirectToHomeIfLoggedIn,
      },
      {
        path: "/",
        element: <PreLoginPage />,
        loader: redirectToHomeIfLoggedIn,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

/**
 * Wraps the apps with providers.
 *
 * The reason for this 'hack' is that the galaxy brains at React Router decided
 * to create a RouterProvider component which doesn't accept children, so you
 * can't --for example-- navigate to the home page after login if the login
 * function is in the AuthContext outside the RouterProvider. We *could* just
 * call the login function directly from its hook, but then we'd have to handle
 * auth stuff (e.g. errors) manually in components.
 */
function AppWrapper() {
  return (
    <>
      <Global styles={globalStyles} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
