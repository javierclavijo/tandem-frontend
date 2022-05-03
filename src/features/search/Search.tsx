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
import SearchElement from "./SearchElement";
import {useInfiniteQuery} from "react-query";
import {User} from "../../entities/User";
import {axiosApi} from "../auth/AuthContext";


export interface UserSearchResponse {
    count: number,
    next: string | null,
    previous: string | null,
    results: User[],
    nextPageNumber: number | null,
    previousPageNumber: number | null
}


function Search() {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    const [searchQuery, setSearchQuery] = React.useState<string>("");

    const {
        data: users,
        fetchNextPage: fetchNextUsersPage
    } = useInfiniteQuery<UserSearchResponse>(["users", "search", searchQuery], async () => {
        const response = await axiosApi.get("/users/", {
            params: {
                name: searchQuery,
                description: searchQuery
            }
        });
        return response.data;
    }, {
        staleTime: 30000,
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
                    <SearchPanel searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                </header>
                <div css={css`
                  background-color: ${colors.WHITE};
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                `}>
                    <h3 css={css`
                      padding: 1rem 1rem 0 1rem;
                    `}>
                        Users
                    </h3>
                    <div css={css`
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                    `}>
                        <SearchElement id="paco1" name={"paco"} languages={["DE"]}
                                       description={"lorem ipsum noseque nosecuanto"}/>
                        <SearchElement id="paco2" name={"paco"} languages={["DE"]}
                                       description={"lorem ipsum noseque nosecuanto"}/>
                        <SearchElement id="paco3" name={"paco"} languages={["DE"]}
                                       description={"lorem ipsum noseque nosecuanto"}/>
                    </div>
                </div>
            </main>
            {!isDesktop ?
                <Tabs/> : null}
        </div>
    );
}

export default Search;
