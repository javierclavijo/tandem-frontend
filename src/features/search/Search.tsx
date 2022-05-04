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


/**
 * Options for the search type select.
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

export interface SearchParams {
    search?: string;
    nativeLanguages?: string[] | null;
    learningLanguages?: string[] | null;
    learningLanguagesLevel?: string | null;
    channelLanguages?: string[] | null;
    channelLevels?: string[] | null;
}


function Search() {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    /**
     * Search params state.
     */
    const [searchParams, setSearchParams] = React.useState<SearchParams>({});

    /**
     * Search type state.
     */
    const [searchType, setSearchType] = React.useState<Option>(searchTypeOptions.USERS);

    const {
        data: usersData,
        fetchNextPage: fetchNextUsersPage,
        hasNextPage: hasNextUsersPage,
        refetch: refetchUsers
    } = useInfiniteQuery<UserSearchResponse>(["users", "search", searchParams], async ({pageParam = 1}) => {
        const response = await axiosApi.get(`/users/`, {
            params: {
                page: pageParam,
                search: searchParams?.search ?? null,
                native_language: searchParams.nativeLanguages,
                learning_language: searchParams.learningLanguages,
                level: searchParams.learningLanguagesLevel,
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: "repeat"})
        });
        return response.data;
    }, {
        staleTime: 30000,
        getPreviousPageParam: firstPage => firstPage.previousPageNumber ?? undefined,
        getNextPageParam: lastPage => lastPage.nextPageNumber ?? undefined
    });

    const {
        data: channelsData,
        fetchNextPage: fetchNextChannelsPage,
        hasNextPage: hasNextChannelsPage,
        refetch: refetchChannels
    } = useInfiniteQuery<ChannelSearchResponse>(["channels", "search", searchParams], async ({pageParam = 1}) => {
        const response = await axiosApi.get(`/channels/`, {
            params: {
                page: pageParam,
                search: searchParams?.search ?? null,
                language: searchParams?.channelLanguages,
                level: searchParams?.channelLevels,
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: "repeat"})
        });
        return response.data;
    }, {
        staleTime: 30000,
        getPreviousPageParam: firstPage => firstPage.previousPageNumber ?? undefined,
        getNextPageParam: lastPage => lastPage.nextPageNumber ?? undefined
    });

    /**
     * Refetch the query whenever the params or search type state is updated.
     */
    React.useEffect(() => {
        if (searchType === searchTypeOptions.USERS) {
            refetchUsers();
        } else {
            refetchChannels();
        }
    }, [searchParams, searchType]);

    return (
        <div css={isDesktop ? baseAppContainerWithoutTabsCss : baseAppContainerWithTabsCss}>
            <Nav/>
            <main css={isDesktop ? searchMain : searchMainMobile}>
                <header css={css`
                  padding: 1rem;
                  background-color: ${colors.WHITE};
                  color: ${colors.DARK};
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                `}>
                    <h2>Find Users & Channels</h2>
                    <SearchPanel setSearchParams={setSearchParams}
                                 searchType={searchType}
                                 setSearchType={setSearchType}/>
                </header>
                <div css={css`
                  height: 100%;
                  background-color: ${colors.WHITE};
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                  overflow-y: scroll;
                `}>
                    {searchType === searchTypeOptions.USERS ?
                        <React.Fragment>
                            <h3 css={css`
                              padding: 1rem 1rem 0 1rem;
                            `}>
                                {searchType === searchTypeOptions.USERS ? "Users" : "Channels"}
                            </h3>
                            <UserSearchResults data={usersData}
                                               fetchNextPage={fetchNextUsersPage}
                                               hasNextPage={hasNextUsersPage}/>
                        </React.Fragment> :
                        <React.Fragment>
                            <h3 css={css`
                              padding: 1rem 1rem 0 1rem;
                            `}>
                                {searchType === searchTypeOptions.USERS ? "Users" : "Channels"}
                            </h3>
                            <ChannelSearchResults data={channelsData}
                                                  fetchNextPage={fetchNextChannelsPage}
                                                  hasNextPage={hasNextChannelsPage}/>
                        </React.Fragment>
                    }

                </div>
            </main>
            {!isDesktop ?
                <Tabs/> : null}
        </div>
    );
}

export default Search;
