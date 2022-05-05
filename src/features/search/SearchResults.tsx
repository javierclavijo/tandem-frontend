/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult} from "react-query";
import {ChannelSearchResponse, UserSearchResponse} from "./Search";
import SearchResultElement from "./SearchResultElement";


interface UserSearchResultsProps {
    data: InfiniteData<UserSearchResponse> | undefined;
    fetchNextPage: (options?: (FetchNextPageOptions | undefined)) => Promise<InfiniteQueryObserverResult<UserSearchResponse, unknown>>;
    hasNextPage: boolean | undefined;
}

interface ChannelSearchResultsProps {
    data: InfiniteData<ChannelSearchResponse> | undefined;
    fetchNextPage: (options?: (FetchNextPageOptions | undefined)) => Promise<InfiniteQueryObserverResult<ChannelSearchResponse, unknown>>;
    hasNextPage: boolean | undefined;
}

function NotFound() {
    return (
        <p css={css`
          padding: 1rem;
        `}>
            No results.
        </p>
    );
}

export function UserSearchResults(props: UserSearchResultsProps) {
    return props.data ?
        <React.Fragment>
            <h3 css={resultsHeader}>
                Users
            </h3>
            <div id="user-search-results-container" css={resultsContainer}>
                {[...props.data?.pages].map((page, pageIndex) =>
                    <React.Fragment key={`page-${pageIndex}`}>
                        {[...page.results].map((element) => (
                            <SearchResultElement id={`${element.id}`}
                                                 name={element.username}
                                                 languages={element.languages.map(l => l.language)}
                                                 description={element.description}
                                                 image={element.image}
                                                 key={`${element.id}`}/>
                        ))}
                    </React.Fragment>
                )}
                {props.data?.pages.length === 0 || props.data?.pages[0].results.length === 0 ?
                    <NotFound/> : null}
            </div>
        </React.Fragment> : null;
}


export function ChannelSearchResults(props: ChannelSearchResultsProps) {
    return props.data ?
        <React.Fragment>
            <h3 css={resultsHeader}>
                Channels
            </h3>
            <div id="channel-search-results-container" css={resultsContainer}>
                {[...props.data?.pages].map((page, pageIndex) =>
                    <React.Fragment key={`page-${pageIndex}`}>
                        {[...page.results].map((element) => (
                            <SearchResultElement id={`${element.id}`}
                                                 name={element.name}
                                                 languages={[element.language]}
                                                 description={element.description}
                                                 image={element.image}
                                                 key={`${element.id}`}/>
                        ))}
                    </React.Fragment>
                )}
                {props.data?.pages.length === 0 || props.data?.pages[0].results.length === 0 ?
                    <NotFound/> : null}
            </div>
        </React.Fragment> : null;
}


const resultsContainer = css`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const resultsHeader = css`
  padding: 1rem 1rem 0 1rem;
`;
