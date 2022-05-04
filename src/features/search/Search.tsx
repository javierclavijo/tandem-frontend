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
import SearchResults from "./SearchResults";
import qs from "qs";
import {Option} from "../../resources/languages";


/**
 * Options for the search type select. Used in the search query's key and URL, and to determine which controls to render
 * in the search panel.
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
        data,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteQuery<UserSearchResponse>([searchType.value, "search", searchParams], async ({pageParam = 1}) => {
        const params = searchType === searchTypeOptions.USERS ? {
            page: pageParam,
            search: searchParams?.search ?? null,
            native_language: searchParams.nativeLanguages,
            learning_language: searchParams.learningLanguages,
            level: searchParams.learningLanguagesLevel,
        } : {
            page: pageParam,
            search: searchParams?.search ?? null,
            language: searchParams?.channelLanguages,
            level: searchParams?.channelLevels,
        };

        const response = await axiosApi.get(`/${searchType.value}/`, {
            params: params,
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
        refetch();
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
                    <h3 css={css`
                      padding: 1rem 1rem 0 1rem;
                    `}>
                        Users
                    </h3>
                    <SearchResults data={data}
                                   fetchNextPage={fetchNextPage}
                                   hasNextPage={hasNextPage}/>
                </div>
            </main>
            {!isDesktop ?
                <Tabs/> : null}
        </div>
    );
}

export default Search;
