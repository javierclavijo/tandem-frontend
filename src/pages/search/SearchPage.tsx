import { css } from "@emotion/react";
import React from "react";
import { Helmet } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { animated } from "react-spring";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import Nav from "../../common/components/Nav/Nav";
import SearchResultElement from "../../common/components/SearchResultElement";
import Tabs from "../../common/components/Tabs";
import { homeSearchStyles } from "../../common/components/styles";
import { useIsDesktop } from "../../common/hooks";
import { homeSearchMain, homeSearchMainMobile } from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import SearchForm from "./components/SearchForm";
import {
  getBaseSearchParams,
  getChannelSearchParams,
  getUserSearchParams,
} from "./functions";
import { useChannelSearchQuery, useUserSearchQuery } from "./queries";
import { ChannelSearchParams, UserSearchParams } from "./types";

/**
 * Main search page. Includes a search panel and the search results list.
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const isDesktop = useIsDesktop();
  const transitionProps = useFadeIn();

  const { type } = getBaseSearchParams(searchParams);
  const isUserSearch = type === "users";
  const isChannelSearch = type === "channels";

  const userSearchParams: UserSearchParams = getUserSearchParams(searchParams);
  const channelSearchParams: ChannelSearchParams =
    getChannelSearchParams(searchParams);

  /**
   * User search query. Enabled only if the search type is set to 'users'.
   */
  const {
    data: usersData,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
  } = useUserSearchQuery(userSearchParams, {
    enabled: isUserSearch,
  });
  /**
   * Channel search query. Enabled only if the search type is set to 'channels'.
   */
  const {
    data: channelsData,
    fetchNextPage: fetchNextChannelsPage,
    hasNextPage: hasNextChannelsPage,
  } = useChannelSearchQuery(channelSearchParams, {
    enabled: isChannelSearch,
  });

  const fetchNextPage = isUserSearch
    ? fetchNextUsersPage
    : fetchNextChannelsPage;
  const hasNextPage = isUserSearch
    ? hasNextUsersPage ?? false
    : hasNextChannelsPage ?? false;
  const data = isUserSearch ? usersData : channelsData;
  const isDataEmpty =
    data?.pages.length === 0 || data?.pages[0].results.length === 0;

  return (
    <>
      <Helmet title="Search | LangFlow" />
      <ResponsiveBottomTabsLayout>
        <Nav />
        <main
          id="search-main"
          css={isDesktop ? homeSearchMain : homeSearchMainMobile}
        >
          {/* Infinite scroll component. Includes the search panel and results. 
              Its properties are assigned conditionally based on the selected 
              search type. */}
          <animated.div style={transitionProps}>
            <InfiniteScroll
              next={fetchNextPage}
              hasMore={hasNextPage}
              loader={<p>Loading...</p>}
              dataLength={data?.pages.length ?? 0}
              scrollableTarget="search-main"
              css={infiniteScroll}
            >
              {/* Heading and search panel. */}
              <header css={homeSearchStyles.header}>
                <h2 css={homeSearchStyles.h2}>Find Users & Channels</h2>
                <SearchForm />
              </header>

              {/* Search results. */}
              <section css={homeSearchStyles.section}>
                <header>
                  <h3 css={homeSearchStyles.sectionHeading}>Search Results</h3>
                </header>
                <div css={homeSearchStyles.sectionItemsContainer}>
                  {isUserSearch &&
                    usersData?.pages.map((page, pageIndex) => (
                      <React.Fragment key={`page-${pageIndex}`}>
                        {[...page.results].map((element) => (
                          <SearchResultElement
                            id={`${element.id}`}
                            name={element.username}
                            languages={element.languages.map(
                              ({ language }) => language,
                            )}
                            description={element.description}
                            image={element.image}
                            key={`${element.id}`}
                            link={`/chats/users/${element.id}`}
                          />
                        ))}
                      </React.Fragment>
                    ))}

                  {isChannelSearch &&
                    channelsData?.pages.map((page, pageIndex) => (
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

                  {isDataEmpty && <p css={notFoundText}>No results.</p>}
                </div>
              </section>
            </InfiniteScroll>
          </animated.div>
        </main>
        <Tabs />
      </ResponsiveBottomTabsLayout>
    </>
  );
};

const infiniteScroll = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const notFoundText = css`
  padding: 1rem;
`;

export default SearchPage;
