import { css } from "@emotion/react";
import React from "react";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "react-query";
import SearchResultElement from "../../../components/SearchResultElement";
import { ChannelSearchResponse, UserSearchResponse } from "../SearchPage";

interface UserSearchResultsProps {
  data: InfiniteData<UserSearchResponse> | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<UserSearchResponse, unknown>>;
  hasNextPage: boolean | undefined;
}

interface ChannelSearchResultsProps {
  data: InfiniteData<ChannelSearchResponse> | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<ChannelSearchResponse, unknown>>;
  hasNextPage: boolean | undefined;
}

const notFoundText = css`
  padding: 1rem;
`;

function NotFound() {
  return <p css={notFoundText}>No results.</p>;
}

/**
 * Search result list for user search.
 */
export function UserSearchResults(props: UserSearchResultsProps) {
  return props.data ? (
    <>
      {props.data?.pages.map((page, pageIndex) => (
        <React.Fragment key={`page-${pageIndex}`}>
          {[...page.results].map((element) => (
            <SearchResultElement
              id={`${element.id}`}
              name={element.username}
              languages={element.languages.map((l) => l.language)}
              description={element.description}
              image={element.image}
              key={`${element.id}`}
              link={`/chats/users/${element.id}`}
            />
          ))}
        </React.Fragment>
      ))}
      {props.data?.pages.length === 0 ||
      props.data?.pages[0].results.length === 0 ? (
        <NotFound />
      ) : null}
    </>
  ) : null;
}

/**
 * Search result list for channel search.
 */
export function ChannelSearchResults(props: ChannelSearchResultsProps) {
  return props.data ? (
    <>
      {props.data?.pages.map((page, pageIndex) => (
        <React.Fragment key={`page-${pageIndex}`}>
          {[...page.results].map((element) => (
            <SearchResultElement
              id={`${element.id}`}
              name={element.name}
              languages={[element.language]}
              description={element.description}
              image={element.image}
              key={`${element.id}`}
              link={`/chats/channels/${element.id}`}
            />
          ))}
        </React.Fragment>
      ))}
      {props.data?.pages.length === 0 ||
      props.data?.pages[0].results.length === 0 ? (
        <NotFound />
      ) : null}
    </>
  ) : null;
}
