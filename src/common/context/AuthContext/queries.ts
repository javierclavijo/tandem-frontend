import { AxiosResponse, isAxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { axiosApi, queryClient } from "../../apis";
import { User } from "../../types";
import { LogInRequestData, SessionInfoResponse } from "./types";

export const LOCAL_STORAGE_LOGGED_IN_KEY = "loggedIn";

const getSessionInfoFromQueryData = (
  sessionInfo: SessionInfoResponse | undefined,
): SessionInfoResponse =>
  sessionInfo != null ? sessionInfo : { id: null, url: null };

/**
 * Sets a 'logged in' entry in LocalStorage.
 *
 * LocalStorage is used here because it is not critical that the
 * application's code remains inaccessible to unauthorized users. Its
 * sole purpose is to enhance UX through redirects.
 * @param success Whether the login or session info request was successful.
 */
const setLocalStorageLoggedIn = () =>
  localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_KEY, "true");

/**
 * Removes the 'logged in' entry from LocalStorage.
 */
const removeLocalStorageLoggedIn = () =>
  localStorage.removeItem(LOCAL_STORAGE_LOGGED_IN_KEY);

/**
 * Fetches the current session's info from the server (user ID and URL, plus
 * CSRF token from the csrftoken cookie) and sets it in the context's state.
 * Runs on init.
 */
export const useSessionInfoQuery = () =>
  useQuery<SessionInfoResponse>(
    ["sessionInfo"],
    async () => {
      const response = await axiosApi.get<SessionInfoResponse>("session_info/");
      return response.data;
    },
    {
      onSuccess(data) {
        if (data.id != null) {
          setLocalStorageLoggedIn();
        } else {
          // Remove the 'logged in' entry from LocalStorage to prevent users
          // from accessing the app while requests don't work (assuming that
          // e.g. their session expired).
          removeLocalStorageLoggedIn();
        }
      },
    },
  );

/**
 * User query. Is disabled unless the user is logged in (i. e. the session
 * info query has returned the user's ID).
 */
export const useUserDetailQuery = (
  sessionInfo: SessionInfoResponse | undefined,
) => {
  const { id, url } = getSessionInfoFromQueryData(sessionInfo);

  return useQuery<User>(
    ["users", id],
    async () => {
      const response = await axiosApi.get(url!);
      return response.data;
    },
    {
      enabled: url != null,
    },
  );
};

/**
 * Sends a login request.
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation<AxiosResponse<void>, Error, LogInRequestData>(
    async (data: LogInRequestData) => {
      try {
        return await axiosApi.post<void>("login/", data);
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) {
          throw new Error("Unable to log in with provided credentials.");
        } else {
          throw new Error("Unable to log in.");
        }
      }
    },
    {
      onSuccess: () => {
        setLocalStorageLoggedIn();
        queryClient.invalidateQueries(["sessionInfo"], { exact: true });
        navigate("/home");
      },
    },
  );
};

/**
 * Sends a logout request.
 */
export const useLogoutMutation = (userId: string | null) => {
  const navigate = useNavigate();

  return useMutation(async () => await axiosApi.post("logout/"), {
    onSettled: () => {
      // Even if the request fails, assure that the user can log out.
      removeLocalStorageLoggedIn();
      queryClient.removeQueries(["users", userId], { exact: true });
      queryClient.removeQueries(["sessionInfo"], { exact: true });
      navigate("/");
    },
  });
};
