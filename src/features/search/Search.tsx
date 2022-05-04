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
    nativeLanguages?: string[];
    learningLanguages?: string[];
    learningLanguagesLevel?: string;
}


function Search() {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const searchParamsRef = React.useRef<SearchParams>({});

    const {
        data,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteQuery<UserSearchResponse>(["users", "search", searchParamsRef.current], async ({pageParam = 1}) => {
        const params = searchParamsRef.current;
        const response = await axiosApi.get("/users/", {
            params: {
                search: params?.search ?? null,
                page: pageParam
            }
        });
        return response.data;
    }, {
        staleTime: 30000,
        getPreviousPageParam: firstPage => firstPage.previousPageNumber ?? undefined,
        getNextPageParam: lastPage => lastPage.nextPageNumber ?? undefined
    });

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
                    <SearchPanel searchParamsRef={searchParamsRef} refetch={refetch}/>
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
