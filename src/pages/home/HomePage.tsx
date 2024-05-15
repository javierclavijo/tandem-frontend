import { css } from "@emotion/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import Nav from "../../common/components/Nav/Nav";
import SearchResultElement from "../../common/components/SearchResultElement";
import Tabs from "../../common/components/Tabs";
import { homeSearchStyles } from "../../common/components/styles";
import useAuth from "../../common/context/AuthContext/AuthContext";
import { COLORS } from "../../common/resources/style-variables";

import {
  baseAppContainerWithTabs,
  baseAppContainerWithoutTabs,
  homeSearchMain,
  homeSearchMainMobile,
} from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import { useChannelChatList, useFriendChatList } from "../chats/queries";
import RecentElement from "./components/RecentElement";
import { useDiscoverUsersList } from "./queries";

/**
 * Post-login home component.
 */
function HomePage() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const transitionProps = useFadeIn();

  const { isLoggedIn, user } = useAuth();

  const { data: friendChats } = useFriendChatList();
  const { data: channelChats } = useChannelChatList();
  const { data: discoverUsers } = useDiscoverUsersList();

  // TODO: I don't like this. Please change it using media queries.
  const container = css`
    ${isDesktop ? baseAppContainerWithoutTabs : baseAppContainerWithTabs};
    height: ${isDesktop ? "auto" : "100vh"};
  `;

  return isLoggedIn && user ? (
    <div css={container}>
      <Nav />
      <main css={isDesktop ? homeSearchMain : homeSearchMainMobile}>
        <animated.header css={homeSearchStyles.header} style={transitionProps}>
          <h2 css={homeSearchStyles.h2}>Home</h2>
          <p>Welcome back, {user.username}</p>
        </animated.header>

        {/* 'Recent chats' section. Contains a list of the latest friend chats. */}
        <animated.section
          css={homeSearchStyles.section}
          style={transitionProps}
        >
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Recent chats</h3>
          </header>
          <div css={homeSearchStyles.sectionItemsContainer}>
            {friendChats
              ?.slice(0, 6)
              .map((chat) => (
                <RecentElement
                  id={chat.id}
                  name={chat.name}
                  latestMessage={`${
                    chat.messages[0].author.id === user.id
                      ? "You"
                      : chat.messages[0].author.username
                  }: ${chat.messages[0].content}`}
                  link={`/chats/${chat.id}`}
                  image={chat.image}
                  key={chat.id}
                />
              ))}
            {!friendChats?.length ? (
              <p>You haven&apos;t chatted with anyone yet.</p>
            ) : null}
          </div>
          <footer css={sectionFooter}>
            <Link to="/chats" css={sectionFooterLink} title="See all chats">
              See all
            </Link>
          </footer>
        </animated.section>

        {/* 'Your channels' section. Contains a list of the latest channel chats. */}
        <animated.section
          css={homeSearchStyles.section}
          style={transitionProps}
        >
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Your channels</h3>
          </header>
          <div css={homeSearchStyles.sectionItemsContainer}>
            {channelChats
              ?.slice(0, 6)
              .map((chat) => (
                <RecentElement
                  id={chat.id}
                  name={chat.name}
                  latestMessage={`${
                    chat.messages[0].author.id === user.id
                      ? "You"
                      : chat.messages[0].author.username
                  }: ${chat.messages[0].content}`}
                  link={`/chats/${chat.id}`}
                  image={chat.image}
                  key={chat.id}
                />
              ))}
            {!channelChats?.length ? (
              <p>You haven&apos;t joined any chats yet.</p>
            ) : null}
          </div>
          <footer css={sectionFooter}>
            <Link to="/chats" css={sectionFooterLink} title="See all chats">
              See all
            </Link>
          </footer>
        </animated.section>

        {/* 'Discover' section. Contains a list of randomized users, excluding friends of the user. */}
        <animated.section
          css={homeSearchStyles.section}
          style={transitionProps}
        >
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Discover</h3>
          </header>
          <div css={homeSearchStyles.sectionItemsContainer}>
            {discoverUsers
              ?.slice(0, 9)
              .map((user) => (
                <SearchResultElement
                  id={user.id}
                  name={user.username}
                  languages={user.languages.map(
                    (language) => language.language,
                  )}
                  description={user.description}
                  link={`/chats/users/${user.id}`}
                  image={user.image}
                  key={user.id}
                />
              ))}
          </div>
          <footer css={sectionFooter}>
            <Link
              to="/search"
              css={sectionFooterLink}
              title="Go to search page"
            >
              See more
            </Link>
          </footer>
        </animated.section>
      </main>
      {!isDesktop ? <Tabs /> : null}
    </div>
  ) : null;
}

const sectionFooter = css`
  width: 100%;
  text-align: end;
`;

const sectionFooterLink = css`
  text-decoration: none;
  color: ${COLORS.PRIMARY};

  &:visited {
    color: ${COLORS.PRIMARY};
  }
`;

export default HomePage;
