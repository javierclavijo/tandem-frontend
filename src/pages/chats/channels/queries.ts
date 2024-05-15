import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { axiosApi, queryClient } from "../../../common/apis";
import { Channel } from "../../../common/types";
import useAuth from "../../auth/AuthContext/AuthContext";
import { UpdateLanguageRequest } from "./types";

/**
 * Query which fetches and holds a channel's data
 */
export function useChannel(id: string | undefined) {
  return useQuery<Channel>(
    ["channels", id],
    async () => {
      const response = await axiosApi.get(`channels/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    },
  );
}

/**
 * Deletes a channel.
 */
export function useDeleteChannel(data: Channel | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteChannelRequest = async () => {
    if (data) {
      return await axiosApi.delete(data?.url);
    }
  };

  const deleteChannelMutation = useMutation(deleteChannelRequest, {
    onSuccess: () => queryClient.invalidateQueries(["chats", "list", "all"]),
  });

  return useCallback(async () => {
    await deleteChannelMutation.mutateAsync();
    navigate("/chats/");
  }, [deleteChannelMutation, navigate]);
}

export function useChangeUserRole(channelId: string | undefined) {
  const queryClient = useQueryClient();

  /**
   * Request function to promote users to moderators or demote them to regular users.
   */
  const updateMembershipRequest = async (args: {
    url: string;
    role: string;
  }) => {
    const response = await axiosApi.patch(args.url, { role: args.role });
    return response.data;
  };

  /**
   * Mutation to promote/demote users. Invalidates the channel detail query on success.
   */
  const updateMembershipMutation = useMutation(updateMembershipRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<Channel>(["channels", channelId]);
    },
  });

  /**
   * Executes the mutation to promote users to moderators.
   * @param url The URL for the user's membership.
   */
  const handleDemoteUser = useCallback(
    async (url: string) =>
      await updateMembershipMutation.mutateAsync({ url, role: "U" }),
    [updateMembershipMutation],
  );

  /**
   * Executes the mutation to demote moderators to regular users.
   * @param url The URL for the user's membership.
   */
  const handlePromoteUser = useCallback(
    async (url: string) =>
      await updateMembershipMutation.mutateAsync({ url, role: "M" }),
    [updateMembershipMutation],
  );

  return useMemo(
    () => ({
      handlePromoteUser,
      handleDemoteUser,
    }),
    [handleDemoteUser, handlePromoteUser],
  );
}

export function useJoinChannel(channel: Channel | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  /**
   * Creates a membership for the user in the provided channel.
   */
  const joinChannelRequest = async () => {
    if (channel) {
      return await axiosApi.post("memberships/", {
        user: user?.url,
        channel: channel?.url,
      });
    }
  };

  /**
   * Sends the request to join the channel.
   */
  return useMutation(joinChannelRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["channels", channel?.id]);
      await queryClient.invalidateQueries(["chats", "list", "all"]);
    },
  });
}

export function useLeaveChannel(channel: Channel | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  /**
   * Finds and deletes the user's membership in the provided channel.
   */
  const leaveChannelRequest = async () => {
    const userMembership = channel?.memberships.find(
      (membership) => membership.user.id === user?.id,
    );
    if (userMembership) {
      return await axiosApi.delete(userMembership.url);
    }
  };

  /**
   * Sends the request to leave the channel.
   */
  return useMutation(leaveChannelRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["channels", channel?.id]);
      await queryClient.invalidateQueries(["chats", "list", "all"]);
    },
  });
}

const updateLanguageRequest = async (requestData: UpdateLanguageRequest) => {
  const { url, ...body } = requestData;
  if (url != null) {
    const response = await axiosApi.patch(url, body);
    return response.data;
  }
};

export const useUpdateLanguageMutation = (id: string | undefined) =>
  useMutation(updateLanguageRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<Channel | undefined>([
        "channels",
        id,
      ]);
    },
  });
