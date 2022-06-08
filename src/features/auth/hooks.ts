import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./AuthContext";

/**
 * Redirects the user to the specified location if they are not logged in.
 */
export const useRedirectIfNotLoggedIn = (url: string) => {
  const { loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate(url);
    }
  }, [navigate, loading, isLoggedIn, url]);
};

/**
 * Redirects the user to the specified location if they are logged in.
 */
export const useRedirectIfLoggedIn = (url: string) => {
  const { loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate(url);
    }
  }, [navigate, loading, isLoggedIn, url]);
};
