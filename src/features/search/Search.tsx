/** @jsxImportSource @emotion/react */

import qs from "qs";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useMediaQuery } from "react-responsive";
import Nav from "../../components/Nav";
import Tabs from "../../components/Tabs";
import { Channel } from "../../entities/Channel";
import { User } from "../../entities/User";
import { Option } from "../../resources/languages";
import { homeSearchStyles } from "../../styles/components";
import {
  baseAppContainerWithoutTabs,
  baseAppContainerWithTabs,
  homeSearchMain,
  homeSearchMainMobile
} from "../../styles/layout";
import { axiosApi } from "../auth/AuthContext";
import SearchPanel from "./SearchPanel";
import { ChannelSearchResults, UserSearchResults } from "./SearchResults";
import qs from "qs";
import { Option } from "../../resources/languages";
import { Channel } from "../../entities/Channel";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRedirectIfNotLoggedIn } from "../auth/hooks";

/**
 * Options for the search type select. Includes a search panel and the search results list.
 */
export const searchTypeOptions = {
  USERS: { value: "users", label: "Users" },
  CHANNELS: { value: "channels", label: "Channels" },
};

export interface UserSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
  nextPageNumber: number | null;
  previousPageNumber: number | null;
}

export interface ChannelSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Channel[];
  nextPageNumber: number | null;
  previousPageNumber: number | null;
}

export interface UserSearchParams {
  search?: string;
  nativeLanguages?: string[] | null;
  learningLanguages?: string[] | null;
  learningLanguagesLevels?: string[] | null;
}

export interface ChannelSearchParams {
  search?: string;
  languages?: string[] | null;
  levels?: string[] | null;
}

/**
 * Main search component.
 */
function Search() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  useRedirectIfNotLoggedIn();

  /**
   * Search params state.
   */
  const [userSearchParams, setUserSearchParams] =
    React.useState<UserSearchParams>({});
  const [channelSearchParams, setChannelSearchParams] =
    React.useState<ChannelSearchParams>({});

  /**
   * Search type state.
   */
  const [searchType, setSearchType] = React.useState<Option>(
    searchTypeOptions.USERS
  );

  /**
   * User search query. Enabled only if the search type is set to 'users'.
   */
  const {
    data: usersData,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    refetch: refetchUsers,
  } = useInfiniteQuery<UserSearchResponse>(
    ["users", "search", userSearchParams],
    async ({ pageParam = 1 }) => {
      const response = await axiosApi.get(`users/`, {
        params: {
          page: pageParam,
          search: userSearchParams.search ?? null,
          native_language: userSearchParams.nativeLanguages,
          learning_language: userSearchParams.learningLanguages,
          level: userSearchParams.learningLanguagesLevels,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      return response.data;
    },
    {
      staleTime: 30000,
      getPreviousPageParam: (firstPage) =>
        firstPage.previousPageNumber ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextPageNumber ?? undefined,
      enabled: searchType === searchTypeOptions.USERS,
    }
  );

  /**
   * Channel search query. Enabled only if the search type is set to 'channels'.
   */
  const {
    data: channelsData,
    fetchNextPage: fetchNextChannelsPage,
    hasNextPage: hasNextChannelsPage,
    refetch: refetchChannels,
  } = useInfiniteQuery<ChannelSearchResponse>(
    ["channels", "search", channelSearchParams],
    async ({ pageParam = 1 }) => {
      const response = await axiosApi.get(`channels/`, {
        params: {
          page: pageParam,
          search: channelSearchParams?.search ?? null,
          language: channelSearchParams?.languages,
          level: channelSearchParams?.levels,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      return response.data;
    },
    {
      staleTime: 30000,
      getPreviousPageParam: (firstPage) =>
        firstPage.previousPageNumber ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextPageNumber ?? undefined,
      enabled: searchType === searchTypeOptions.CHANNELS,
    }
  );

  /**
   * Refetch the queries whenever the params or search type state is updated.
   */
  React.useEffect(() => {
    if (searchType === searchTypeOptions.USERS) {
      refetchUsers();
    } else {
      refetchChannels();
    }
  }, [
    userSearchParams,
    channelSearchParams,
    searchType,
    refetchChannels,
    refetchUsers,
  ]);

  return (
    <div
      css={isDesktop ? baseAppContainerWithoutTabs : baseAppContainerWithTabs}
    >
      <Nav />
      <main
        id="search-main"
        css={isDesktop ? homeSearchMain : homeSearchMainMobile}
      >
        {/* Infinite scroll component. Includes the search panel and results. Its properties are assigned
                conditionally based on the selected search type. */}
        <InfiniteScroll
          next={
            searchType === searchTypeOptions.USERS
              ? fetchNextUsersPage
              : fetchNextChannelsPage
          }
          hasMore={
            searchType === searchTypeOptions.USERS
              ? hasNextUsersPage ?? false
              : hasNextChannelsPage ?? false
          }
          loader={<p>Loading...</p>}
          dataLength={
            searchType === searchTypeOptions.USERS
              ? usersData?.pages.length ?? 0
              : channelsData?.pages.length ?? 0
          }
          scrollableTarget="search-main"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Heading and search panel. */}
          <header css={homeSearchStyles.header}>
            <h2 css={homeSearchStyles.h2}>Find Users & Channels</h2>
            <SearchPanel
              setUserSearchParams={setUserSearchParams}
              setChannelSearchParams={setChannelSearchParams}
              searchType={searchType}
              setSearchType={setSearchType}
            />
          </header>

          {/* Search results. */}
          <section css={homeSearchStyles.section}>
            <header>
              <h3 css={homeSearchStyles.sectionHeading}>
                {searchType === searchTypeOptions.USERS ? "Users" : "Channels"}
              </h3>
            </header>
            <div css={homeSearchStyles.sectionItemsContainer}>
              {searchType === searchTypeOptions.USERS ? (
                <React.Fragment>
                  <UserSearchResults
                    data={usersData}
                    fetchNextPage={fetchNextUsersPage}
                    hasNextPage={hasNextUsersPage}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ChannelSearchResults
                    data={channelsData}
                    fetchNextPage={fetchNextChannelsPage}
                    hasNextPage={hasNextChannelsPage}
                  />
                </React.Fragment>
              )}
            </div>
          </section>
        </InfiniteScroll>
      </main>
      {!isDesktop ? <Tabs /> : null}
    </div>
  );
}

export default Search;
