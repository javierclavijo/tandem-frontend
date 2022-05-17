/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import React from 'react';
import { InfiniteData } from 'react-query';
import { ChannelSearchResponse, UserSearchResponse } from './Search';
import SearchResultElement from './SearchResultElement';

interface UserSearchResultsProps {
  data: InfiniteData<UserSearchResponse> | undefined;
}

interface ChannelSearchResultsProps {
  data: InfiniteData<ChannelSearchResponse> | undefined;
}

function NotFound() {
  return (
    <p css={css`
          padding: 1rem;
        `}
    >
      No results.
    </p>
  );
}

export function UserSearchResults({ data }: UserSearchResultsProps) {
  return data
    ? (
      <>
        {[...data.pages].map((page, pageIndex) => (
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
        {data?.pages.length === 0 || data?.pages[0].results.length === 0
          ? <NotFound /> : null}
      </>
    ) : null;
}

export function ChannelSearchResults({data}: ChannelSearchResultsProps) {
  return data
    ? (
      <>
        {[...data.pages].map((page, pageIndex) => (
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
        {data?.pages.length === 0 || data?.pages[0].results.length === 0
          ? <NotFound /> : null}
      </>
    ) : null;
}
