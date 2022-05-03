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

function Search() {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

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
                    <SearchPanel/>
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
                        <SearchElement name={"paco"} languages={["DE"]} description={"lorem ipsum noseque nosecuanto"}/>
                        <SearchElement name={"paco"} languages={["DE"]} description={"lorem ipsum noseque nosecuanto"}/>
                        <SearchElement name={"paco"} languages={["DE"]} description={"lorem ipsum noseque nosecuanto"}/>
                    </div>
                </div>
            </main>
            {!isDesktop ?
                <Tabs/> : null}
        </div>
    );
}

export default Search;
