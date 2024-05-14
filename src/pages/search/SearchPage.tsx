import qs from "qs";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useMediaQuery } from "react-responsive";
import { animated } from "react-spring";
import { axiosApi } from "../../App";
import Nav from "../../components/Nav/Nav";
import Tabs from "../../components/Tabs";
import { homeSearchStyles } from "../../components/styles";
import { useRedirectIfNotLoggedIn } from "../auth/hooks";

import {
  baseAppContainerWithTabs,
  baseAppContainerWithoutTabs,
  homeSearchMain,
  homeSearchMainMobile,
} from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import {
  Channel,
  Language,
  Option,
  ProficiencyLevel,
  User,
} from "../../common/types";
import SearchPanel from "./components/SearchPanel";
import {
  ChannelSearchResults,
  UserSearchResults,
} from "./components/SearchResults";

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

interface BaseSearchParams {
  type: string;
  search?: string;
}

export interface UserSearchParams extends BaseSearchParams {
  search?: string;
  nativeLanguages?: Language[] | null;
  learningLanguages?: Language[] | null;
  learningLanguagesLevels?: ProficiencyLevel[] | null;
}

export interface ChannelSearchParams extends BaseSearchParams {
  search?: string;
  languages?: string[] | null;
  levels?: string[] | null;
}

/**
 * Main search component.
 */
function SearchPage() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  useRedirectIfNotLoggedIn("/login");
  const transitionProps = useFadeIn();

  /**
   * Search params state.
   */
  const [userSearchParams, setUserSearchParams] =
    React.useState<UserSearchParams | null>(null);
  const [channelSearchParams, setChannelSearchParams] =
    React.useState<ChannelSearchParams | null>(null);

  /**
   * Search type state.
   */
  const [searchType, setSearchType] = React.useState<Option | null>(
    searchTypeOptions.USERS,
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
          search: userSearchParams?.search ?? null,
          native_language: userSearchParams?.nativeLanguages,
          learning_language: userSearchParams?.learningLanguages,
          level: userSearchParams?.learningLanguagesLevels,
          size: 18,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      return response.data;
    },
    {
      getPreviousPageParam: (firstPage) =>
        firstPage.previousPageNumber ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextPageNumber ?? undefined,
      enabled: searchType === searchTypeOptions.USERS,
    },
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
          size: 18,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      return response.data;
    },
    {
      getPreviousPageParam: (firstPage) =>
        firstPage.previousPageNumber ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextPageNumber ?? undefined,
      enabled: searchType === searchTypeOptions.CHANNELS,
    },
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
        <animated.div style={transitionProps}>
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
                  {searchType === searchTypeOptions.USERS
                    ? "Users"
                    : "Channels"}
                </h3>
              </header>
              <div css={homeSearchStyles.sectionItemsContainer}>
                {searchType === searchTypeOptions.USERS ? (
                  <>
                    <UserSearchResults
                      data={usersData}
                      fetchNextPage={fetchNextUsersPage}
                      hasNextPage={hasNextUsersPage}
                    />
                  </>
                ) : (
                  <>
                    <ChannelSearchResults
                      data={channelsData}
                      fetchNextPage={fetchNextChannelsPage}
                      hasNextPage={hasNextChannelsPage}
                    />
                  </>
                )}
              </div>
            </section>
          </InfiniteScroll>
        </animated.div>
      </main>
      {!isDesktop ? <Tabs /> : null}
    </div>
  );
}

export default SearchPage;
