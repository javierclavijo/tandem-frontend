/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import InfiniteScroll from "react-infinite-scroll-component";
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


export function UserSearchResults(props: UserSearchResultsProps) {
    return props.data ?
        <div id="search-results-container" css={css`
          overflow: auto;
          height: 100%;
          display: flex;
          flex-direction: column;
        `}>
            <InfiniteScroll next={props.fetchNextPage}
                            hasMore={!!props.hasNextPage}
                            loader={<p>Loading...</p>}
                            dataLength={props.data.pages.length}
                            scrollableTarget="search-results-container"
                            style={{display: "flex", flexDirection: "column"}}
            >
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
            </InfiniteScroll>
        </div> : null;
}


export function ChannelSearchResults(props: ChannelSearchResultsProps) {
    return props.data ?
        <div id="search-results-container" css={resultsContainer}>
            <InfiniteScroll next={props.fetchNextPage}
                            hasMore={!!props.hasNextPage}
                            loader={<p>Loading...</p>}
                            dataLength={props.data.pages.length}
                            scrollableTarget="search-results-container"
                            style={{display: "flex", flexDirection: "column"}}
            >
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
            </InfiniteScroll>
        </div> : null;
}


const resultsContainer = css`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

