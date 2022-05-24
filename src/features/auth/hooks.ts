import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./AuthContext";

export const useRedirectIfNotLoggedIn = () => {
  const { loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
  }, [navigate, loading, isLoggedIn]);
};
