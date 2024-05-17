import { css } from "@emotion/react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { animated } from "react-spring";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import Nav from "../../common/components/Nav/Nav";
import SearchResultElement from "../../common/components/SearchResultElement";
import Tabs from "../../common/components/Tabs";
import { homeSearchStyles } from "../../common/components/styles";
import { useIsDesktop } from "../../common/hooks";
import { homeSearchMain, homeSearchMainMobile } from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import { Option } from "../../common/types";
import { ChatType } from "../chats/types";
import SearchPanel from "./components/SearchPanel";
import { useChannelSearchQuery, useUserSearchQuery } from "./queries";
import { ChannelSearchParams, UserSearchParams } from "./types";

/**
 * Main search page. Includes a search panel and the search results list.
 */
function SearchPage() {
  const isDesktop = useIsDesktop();
  const transitionProps = useFadeIn();

  /**
   * Search params state.
   */
  const [userSearchParams, setUserSearchParams] =
    useState<UserSearchParams | null>(null);
  const [channelSearchParams, setChannelSearchParams] =
    useState<ChannelSearchParams | null>(null);
  /**
   * Search type state.
   */
  const [searchType, setSearchType] = useState<Option<ChatType> | null>(
    searchTypeOptions.USERS,
  );

  const isUserSearch = searchType?.value === "users";

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
    enabled: searchType === searchTypeOptions.CHANNELS,
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
          {/* Infinite scroll component. Includes the search panel and results. Its properties are assigned
                conditionally based on the selected search type. */}
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
                <SearchPanel
                  onUserParamsChange={setUserSearchParams}
                  onChannelParamsChange={setChannelSearchParams}
                  searchType={searchType}
                  onSearchTypeChange={setSearchType}
                />
              </header>

              {/* Search results. */}
              <section css={homeSearchStyles.section}>
                <header>
                  <h3 css={homeSearchStyles.sectionHeading}>Search Results</h3>
                </header>
                <div css={homeSearchStyles.sectionItemsContainer}>
                  {isUserSearch
                    ? usersData?.pages.map((page, pageIndex) => (
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
                      ))
                    : channelsData?.pages.map((page, pageIndex) => (
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
}

/**
 * Options for the search type select.
 */
export const searchTypeOptions: Readonly<Record<string, Option<ChatType>>> = {
  USERS: { value: "users", label: "Users" },
  CHANNELS: { value: "channels", label: "Channels" },
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
