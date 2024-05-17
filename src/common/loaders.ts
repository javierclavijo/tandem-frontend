import { redirect } from "react-router-dom";
import { LOCAL_STORAGE_LOGGED_IN_KEY } from "./context/AuthContext/queries";

const redirectIfNotLoggedIn = (url: string) => {
  const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_LOGGED_IN_KEY) != null;

  if (!isLoggedIn) {
    return redirect(url);
  }

  return null;
};

const redirectIfLoggedIn = (url: string) => {
  const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_LOGGED_IN_KEY) != null;

  if (isLoggedIn) {
    return redirect(url);
  }

  return null;
};

export const redirectToLoginIfNotLoggedIn = () =>
  redirectIfNotLoggedIn("/auth/login");

export const redirectToHomeIfLoggedIn = () => redirectIfLoggedIn("/home");
