import qs from "qs";
import { useInfiniteQuery } from "react-query";
import { axiosApi } from "../../common/apis";
import { Channel, User } from "../../common/types";
import {
  ChannelSearchParams,
  InfiniteQueryOptions,
  SearchResponse,
  UserSearchParams,
} from "./types";

/**
 * User search query. Enabled only if the search type is set to 'users'.
 */
export const useUserSearchQuery = (
  params: UserSearchParams | null,
  options: InfiniteQueryOptions<User>,
) =>
  useInfiniteQuery<SearchResponse<User>>(
    ["users", "search", params],
    async ({ pageParam = 1 }) => {
      const response = await axiosApi.get<SearchResponse<User>>(`users/`, {
        params: {
          page: pageParam,
          search: params?.search ?? null,
          native_language: params?.nativeLanguages,
          learning_language: params?.learningLanguages,
          level: params?.learningLanguageLevels,
          size: 30,
        },
        paramsSerializer,
      });
      return response.data;
    },
    {
      getPreviousPageParam,
      getNextPageParam,
      ...options,
    },
  );

/**
 * Channel search query. Enabled only if the search type is set to 'channels'.
 */
export const useChannelSearchQuery = (
  params: ChannelSearchParams | null,
  options: InfiniteQueryOptions<Channel>,
) =>
  useInfiniteQuery<SearchResponse<Channel>>(
    ["channels", "search", params],
    async ({ pageParam = 1 }) => {
      const response = await axiosApi.get(`channels/`, {
        params: {
          page: pageParam,
          search: params?.search ?? null,
          language: params?.languages,
          level: params?.levels,
          size: 30,
        },
        paramsSerializer,
      });
      return response.data;
    },
    {
      getPreviousPageParam,
      getNextPageParam,
      ...options,
    },
  );

const paramsSerializer = (params: Record<string, unknown>) =>
  qs.stringify(params, { arrayFormat: "repeat" });
const getPreviousPageParam = <TData>(firstPage: SearchResponse<TData>) =>
  firstPage.previousPageNumber ?? undefined;
const getNextPageParam = <TData>(lastPage: SearchResponse<TData>) =>
  lastPage.nextPageNumber ?? undefined;
