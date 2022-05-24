import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/AuthContext";
import { useRedirectIfNotLoggedIn } from "../auth/hooks";

function Home() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useRedirectIfNotLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chats");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return <React.Fragment />;
}

export default Home;
