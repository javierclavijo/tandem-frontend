import { AxiosError, AxiosResponse } from "axios";
import { UseMutationOptions, useMutation, useQueryClient } from "react-query";
import { axiosApi } from "../../../../common/apis";
import { Channel, ServerErrorResponse } from "../../../../common/types";
import { ChannelCreationRequest } from "./types";

const createChannelRequest = async (data: ChannelCreationRequest) =>
  await axiosApi.post<Channel>("channels/", data);

export const useCreateChannelMutation = (
  options: Omit<
    UseMutationOptions<
      AxiosResponse<Channel>,
      AxiosError<ServerErrorResponse>,
      ChannelCreationRequest,
      unknown
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChannelRequest,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["chats", "list", "all"]);
      options.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
