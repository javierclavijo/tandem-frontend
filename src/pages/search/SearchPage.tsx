import { css } from "@emotion/react";
import { Helmet } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { animated } from "react-spring";
import Header from "../../common/components/Header/Header";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import Tabs from "../../common/components/Tabs";
import UserCard from "../../common/components/UserCard";
import { useWsChatListener } from "../../common/hooks";
import { homeSearchMain, homeSearchStyles } from "../../common/styles";
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
  const transitionProps = useFadeIn();
  useWsChatListener();

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
        <Header />
        <main id="search-main" css={homeSearchMain}>
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
                  {!!isUserSearch &&
                    usersData?.pages.map((page) =>
                      [...page.results].map((element) => (
                        <UserCard
                          name={element.username}
                          languages={element.languages.map(
                            ({ language }) => language,
                          )}
                          content={element.description}
                          image={element.image}
                          key={`${element.id}`}
                          link={`/chats/users/${element.id}`}
                          maxContentLines={1}
                        />
                      )),
                    )}

                  {!!isChannelSearch &&
                    channelsData?.pages.map((page) =>
                      [...page.results].map((element) => (
                        <UserCard
                          name={element.name}
                          languages={[element.language]}
                          content={element.description}
                          image={element.image}
                          key={`${element.id}`}
                          link={`/chats/channels/${element.id}`}
                          maxContentLines={1}
                        />
                      )),
                    )}

                  {!!isDataEmpty && <p css={notFoundText}>No results.</p>}
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
