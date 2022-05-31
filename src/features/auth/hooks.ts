import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./AuthContext";

export const useRedirectIfNotLoggedIn = (url: string) => {
  const { loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate(url);
    }
  }, [navigate, loading, isLoggedIn, url]);
};

export const useRedirectIfLoggedIn = (url: string) => {
  const { loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate(url);
    }
  }, [navigate, loading, isLoggedIn, url]);
};
