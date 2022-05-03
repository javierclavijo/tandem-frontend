/** @jsxImportSource @emotion/react */

import React from "react";
import {baseAppContainerWithoutTabsCss, baseAppContainerWithTabsCss} from "../../styles/layout";
import Nav from "../../components/Nav";
import {mainCss} from "../chats/styles";
import {useMediaQuery} from "react-responsive";
import Tabs from "../../components/Tabs";

function Search() {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});

    return (
        <div css={isDesktop ? baseAppContainerWithoutTabsCss : baseAppContainerWithTabsCss}>
            <Nav/>
            <main css={mainCss}>
                <div>Search!</div>
            </main>
            {!isDesktop ?
                <Tabs/> : null}
        </div>
    );
}

export default Search;
