import axios from "axios";
import React, { useContext, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosApi } from "../../../App";
import { User } from "../../../common/types";
import { AuthContextType, LogInRequestData } from "./types";

export const AuthContext = React.createContext<AuthContextType>(
  // TODO:review this type assertion
  {} as AuthContextType,
);

// TODO: refactor using RQ

/**
 * Authentication context provider for the app. Fetches and provides information about authentication and the user,
 * and provides functions to log in and log out.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  /**
   * ID of the session's user. Used in the user's query key to identify the query.
   */
  const [id, setId] = useState<string>("");

  /**
   * URL of the detail endpoint for the session's user. Used to fetch the user's data.
   */
  const [url, setUrl] = useState<string>("");

  /**
   * Holds whether the user is logged in or not.
   */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  /**
   * Holds errors sent by the server, if any.
   */
  const [error, setError] = useState<string>("");

  /**
   * Holds whether the login request is being executed or not.
   */
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Session's user query. Is disabled unless the user is logged in.
   */
  const { data: user } = useQuery<User>(
    ["users", id],
    async () => {
      const response = await axiosApi.get(url);
      return response.data;
    },
    {
      enabled: isLoggedIn && !!url && !!id,
    },
  );

  /**
   * Fetches the current session's info from the server (user ID and URL, plus CSRF token from the csrftoken cookie)
   * and sets it in the context's state. Runs on init.
   */
  const fetchSessionInfo = React.useCallback(async () => {
    setLoading(true);
    const response = await axiosApi.get("session_info/");
    if (!!response.data.id && !!response.data.url) {
      setId(response.data.id);
      setUrl(response.data.url);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  /**
   * On init, fetch session info and get the CSRF cookie.
   */
  React.useEffect(() => {
    fetchSessionInfo();
  }, [fetchSessionInfo]);

  /**
   * Sends a login request.
   */
  const loginMutation = useMutation(
    async (data: LogInRequestData) =>
      await axiosApi.post<LogInRequestData>("login/", data),
  );

  /**
   * Handles user login, setting the auth context's state (error, loading, isLoggedIn) accordingly.
   */
  const login = React.useCallback(
    async (data: LogInRequestData) => {
      setLoading(true);
      setError("");
      try {
        await loginMutation.mutateAsync(data);
        await fetchSessionInfo();
        setIsLoggedIn(true);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          if (e.response.status === 401) {
            setError("Unable to log in with provided credentials.");
          } else {
            setError("Unable to log in.");
          }
        }
      } finally {
        setLoading(false);
      }
      return;
    },
    [loginMutation, fetchSessionInfo],
  );

  /**
   * Sends a logout request.
   */
  const logoutMutation = useMutation(
    async () => await axiosApi.post("logout/"),
  );

  /**
   * Handles user logout, setting the auth context's state accordingly and removing the session user's query.
   */
  const logout = React.useCallback(async () => {
    await logoutMutation.mutateAsync();
    setIsLoggedIn(false);

    // On logout, remove the logged-in user query to avoid keeping the user's data in cache
    queryClient.removeQueries(["users", id], { exact: true });
  }, [id, queryClient, logoutMutation]);

  // TODO: review this. Does it make sense to memoize?
  const memoedValue = useMemo(
    () => ({
      user,
      error,
      loading,
      isLoggedIn,
      login,
      logout,
    }),
    [user, error, loading, isLoggedIn, login, logout],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}

// Code inspired by https://dev.to/finiam/predictable-react-authentication-with-the-context-api-g10,
// https://lo-victoria.com/introduction-to-react-context-api-with-firebase-authentication
// and https://egreb.net/blog/react-auth-with-react-query-and-axios/
