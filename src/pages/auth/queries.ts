import { AxiosError, AxiosResponse } from "axios";
import { UseMutationOptions, useMutation } from "react-query";
import { axiosApi } from "../../api";
import { ServerErrorResponse, User } from "../../common/types";
import { RegisterRequestData } from "./types";

const registerRequest = async (data: RegisterRequestData) => {
  return await axiosApi.post<User, AxiosResponse<User>, RegisterRequestData>(
    "users/",
    data,
  );
};

export const useRegisterMutation = (
  options: Omit<
    UseMutationOptions<
      AxiosResponse<User>,
      AxiosError<ServerErrorResponse>,
      RegisterRequestData,
      unknown
    >,
    "mutationFn"
  >,
) =>
  useMutation({
    mutationFn: registerRequest,
    ...options,
  });
