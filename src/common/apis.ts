import axios from "axios";
import { QueryClient } from "react-query";

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

/**
 * Context object for React Helmet provider.
 */
export const helmetContext = {};
