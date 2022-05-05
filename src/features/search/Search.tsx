/** @jsxImportSource @emotion/react */

import React from "react";
import {baseAppContainerWithoutTabsCss, baseAppContainerWithTabsCss} from "../../styles/layout";
import Nav from "../../components/Nav";
import {useMediaQuery} from "react-responsive";
import Tabs from "../../components/Tabs";
import SearchPanel from "./SearchPanel";
import {searchMain, searchMainMobile} from "./styles";
import {css} from "@emotion/react";
import {colors} from "../../styles/variables";
import {useInfiniteQuery} from "react-query";
import {User} from "../../entities/User";
import {axiosApi} from "../auth/AuthContext";
import {ChannelSearchResults, UserSearchResults} from "./SearchResults";
import qs from "qs";
import {Option} from "../../resources/languages";
import {Channel} from "../../entities/Channel";
import InfiniteScroll from "react-infinite-scroll-component";


/**
 * Options for the search type select. Includes a search panel and the search results list.
 */
export const searchTypeOptions = {
    USERS: {value: "users", label: "Users"},
    CHANNELS: {value: "channels", label: "Channels"}
};

export interface UserSearchResponse {
    count: number,
    next: string | null,
    previous: string | null,
    results: User[],
    nextPageNumber: number | null,
    previousPageNumber: number | null
}

export interface ChannelSearchResponse {
    count: number,
    next: string | null,
    previous: string | null,
    results: Channel[],
    nextPageNumber: number | null,
    previousPageNumber: number | null
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

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    /**
     * Search params state.
     */
    const [userSearchParams, setUserSearchParams] = React.useState<UserSearchParams>({});
    const [channelSearchParams, setChannelSearchParams] = React.useState<ChannelSearchParams>({});

    /**
     * Search type state.
     */
    const [searchType, setSearchType] = React.useState<Option>(searchTypeOptions.USERS);

    /**
     * User search query. Enabled only if the search type is set to 'users'.
     */
    const {
        data: usersData,
        fetchNextPage: fetchNextUsersPage,
        hasNextPage: hasNextUsersPage,
        refetch: refetchUsers
    } = useInfiniteQuery<UserSearchResponse>(["users", "search", userSearchParams], async ({pageParam = 1}) => {
        const response = await axiosApi.get(`/users/`, {
            params: {
                page: pageParam,
                search: userSearchParams.search ?? null,
                native_language: userSearchParams.nativeLanguages,
                learning_language: userSearchParams.learningLanguages,
                level: userSearchParams.learningLanguagesLevels,
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: "repeat"})
        });
        return response.data;
    }, {
        staleTime: 30000,
        getPreviousPageParam: firstPage => firstPage.previousPageNumber ?? undefined,
        getNextPageParam: lastPage => lastPage.nextPageNumber ?? undefined,
        enabled: searchType === searchTypeOptions.USERS
    });

    /**
     * Channel search query. Enabled only if the search type is set to 'channels'.
     */
    const {
        data: channelsData,
        fetchNextPage: fetchNextChannelsPage,
        hasNextPage: hasNextChannelsPage,
        refetch: refetchChannels
    } = useInfiniteQuery<ChannelSearchResponse>(["channels", "search", channelSearchParams], async ({pageParam = 1}) => {
        const response = await axiosApi.get(`/channels/`, {
            params: {
                page: pageParam,
                search: channelSearchParams?.search ?? null,
                language: channelSearchParams?.languages,
                level: channelSearchParams?.levels,
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: "repeat"})
        });
        return response.data;
    }, {
        staleTime: 30000,
        getPreviousPageParam: firstPage => firstPage.previousPageNumber ?? undefined,
        getNextPageParam: lastPage => lastPage.nextPageNumber ?? undefined,
        enabled: searchType === searchTypeOptions.CHANNELS
    });

    /**
     * Refetch the queries whenever the params or search type state is updated.
     */
    React.useEffect(() => {
        if (searchType === searchTypeOptions.USERS) {
            refetchUsers();
        } else {
            refetchChannels();
        }
    }, [userSearchParams, channelSearchParams, searchType, refetchChannels, refetchUsers]);

    return (
        <div css={isDesktop ? baseAppContainerWithoutTabsCss : baseAppContainerWithTabsCss}>
            <Nav/>
            <main id="search-main" css={css`${isDesktop ? searchMain : searchMainMobile};
              overflow: auto;
              height: 100%;
              display: flex;
              flex-direction: column;
            `}>
                {/* Infinite scroll component. Includes the search panel and results. Its properties are assigned
                conditionally based on the selected search type. */}
                <InfiniteScroll
                    next={searchType === searchTypeOptions.USERS ? fetchNextUsersPage : fetchNextChannelsPage}
                    hasMore={searchType === searchTypeOptions.USERS ? hasNextUsersPage ?? false : hasNextChannelsPage ?? false}
                    loader={<p>Loading...</p>}
                    dataLength={searchType === searchTypeOptions.USERS ? usersData?.pages.length ?? 0 : channelsData?.pages.length ?? 0}
                    scrollableTarget="search-main"
                    style={{display: "flex", flexDirection: "column", gap: "1rem"}}
                >
                    {/* Heading and search panel. */}
                    <header css={css`
                      padding: 1rem;
                      background-color: ${colors.WHITE};
                      color: ${colors.DARK};
                      display: flex;
                      flex-direction: column;
                      gap: 1rem;
                    `}>
                        <h2>Find Users & Channels</h2>
                        <SearchPanel setUserSearchParams={setUserSearchParams}
                                     setChannelSearchParams={setChannelSearchParams}
                                     searchType={searchType}
                                     setSearchType={setSearchType}/>
                    </header>

                    {/* Search results. */}
                    <section css={css`
                      height: 100%;
                      background-color: ${colors.WHITE};
                      display: flex;
                      flex-direction: column;
                      gap: 1rem;
                    `}>
                        <h3 css={css`
                          padding: 1rem 1rem 0 1rem;
                        `}>
                            {searchType === searchTypeOptions.USERS ? "Users" : "Channels"}
                        </h3>
                        <div css={css`
                          display: grid;
                          @media (min-width: 1024px) {
                            grid-template-columns: repeat(3, 1fr);
                          }
                        `}>
                            {searchType === searchTypeOptions.USERS ?
                                <React.Fragment>
                                    <UserSearchResults data={usersData}
                                                       fetchNextPage={fetchNextUsersPage}
                                                       hasNextPage={hasNextUsersPage}/>
                                </React.Fragment> :
                                <React.Fragment>
                                    <ChannelSearchResults data={channelsData}
                                                          fetchNextPage={fetchNextChannelsPage}
                                                          hasNextPage={hasNextChannelsPage}/>
                                </React.Fragment>
                            }
                        </div>
                    </section>
                </InfiniteScroll>
            </main>
            {!isDesktop ?
                <Tabs/> : null}
        </div>
    );
}


export default Search;
