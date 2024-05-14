import React, { useContext, useDeferredValue, useMemo } from "react";
import {
  useLoginMutation,
  useLogoutMutation,
  useSessionInfoQuery,
  useUserDetailQuery,
} from "./queries";
import { AuthContextType } from "./types";

// Note on type assertion: as per React's documentation, the default value
// shouldn't matter at all and could even be null.
// See https://react.dev/reference/react/createContext#parameters
export const AuthContext = React.createContext<AuthContextType>({
  user: undefined,
  error: undefined,
  loading: false,
  isLoggedIn: false,
} as AuthContextType);

/**
 * Authentication context provider for the app. Fetches and provides information
 * about the user and provides functions to log in and log out.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionInfo, isLoading: isSessionInfoLoading } =
    useSessionInfoQuery();

  const { data: user } = useUserDetailQuery(sessionInfo);

  const userId = user?.id ?? null;

  const loginMutation = useLoginMutation();

  const logoutMutation = useLogoutMutation(userId);

  const loading = useDeferredValue(
    isSessionInfoLoading || loginMutation.isLoading || logoutMutation.isLoading,
  );

  const memoedValue: AuthContextType = useMemo(
    () => ({
      user,
      error: loginMutation.error?.message,
      loading,
      isLoggedIn: sessionInfo?.id != null,
      login: loginMutation.mutateAsync,
      logout: logoutMutation.mutateAsync,
    }),
    [
      user,
      loginMutation.error,
      loading,
      sessionInfo?.id,
      loginMutation.mutateAsync,
      logoutMutation.mutateAsync,
    ],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
