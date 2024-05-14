import { AxiosResponse, isAxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { axiosApi, queryClient } from "../../../App";
import { User } from "../../../common/types";
import { LogInRequestData, SessionInfoResponse } from "./types";

const getSessionInfoFromQueryData = (
  sessionInfo: SessionInfoResponse | undefined,
): SessionInfoResponse =>
  sessionInfo != null ? sessionInfo : { id: null, url: null };

export const invalidateUserQueries = (userId: string | null) => {
  queryClient.invalidateQueries(["users", userId], { exact: true });
  queryClient.invalidateQueries(["sessionInfo"], { exact: true });
};

/**
 * Fetches the current session's info from the server (user ID and URL, plus
 * CSRF token from the csrftoken cookie) and sets it in the context's state.
 * Runs on init.
 */
export const useSessionInfoQuery = () =>
  useQuery<SessionInfoResponse>(["sessionInfo"], async () => {
    const response = await axiosApi.get<SessionInfoResponse>("session_info/");
    return response.data;
  });

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
export const useLoginMutation = (
  sessionInfo: SessionInfoResponse | undefined,
) => {
  const { id } = getSessionInfoFromQueryData(sessionInfo);

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
    { onSuccess: () => invalidateUserQueries(id) },
  );
};

/**
 * Sends a logout request.
 */
export const useLogoutMutation = (
  sessionInfo: SessionInfoResponse | undefined,
) => {
  const { id } = getSessionInfoFromQueryData(sessionInfo);

  return useMutation(async () => await axiosApi.post("logout/"), {
    onSuccess: () => invalidateUserQueries(id),
  });
};
