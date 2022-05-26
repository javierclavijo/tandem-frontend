/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import Nav from "../../components/Nav";
import { homeSearchStyles } from "../../styles/components";
import {
  baseAppContainerWithoutTabs,
  baseAppContainerWithTabs,
  homeSearchMain,
  homeSearchMainMobile,
} from "../../styles/layout";
import { colors } from "../../styles/variables";
import useAuth from "../auth/AuthContext";
import { useRedirectIfNotLoggedIn } from "../auth/hooks";
import { useChannelChatList, useFriendChatList } from "../chats/hooks";
import SearchResultElement from "../search/SearchResultElement";
import { useDiscoverUsersList } from "./hooks";
import RecentElement from "./RecentElement";
import { useFadeIn } from "../../utils/transitions";

function Home() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const transitionProps = useFadeIn();

  const { isLoggedIn, user } = useAuth();
  useRedirectIfNotLoggedIn();

  const { data: friendChats } = useFriendChatList();
  const { data: channelChats } = useChannelChatList();
  const { data: discoverUsers } = useDiscoverUsersList();

  const container = css`
    ${isDesktop ? baseAppContainerWithoutTabs : baseAppContainerWithTabs};
    height: auto;
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
            {friendChats?.slice(0, 6).map((chat) => (
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
          </div>
          <footer css={sectionFooter}>
            <Link to="/chats" css={sectionFooterLink}>
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
            {channelChats?.slice(0, 6).map((chat) => (
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
          </div>
          <footer css={sectionFooter}>
            <Link to="/chats" css={sectionFooterLink}>
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
            {discoverUsers?.slice(0, 9).map((user) => (
              <SearchResultElement
                id={user.id}
                name={user.username}
                languages={user.languages.map((language) => language.language)}
                description={user.description}
                link={`/chats/users/${user.id}`}
                image={user.image}
                key={user.id}
              />
            ))}
          </div>
          <footer css={sectionFooter}>
            <Link to="/search" css={sectionFooterLink}>
              See more
            </Link>
          </footer>
        </animated.section>
      </main>
    </div>
  ) : null;
}

const sectionFooter = css`
  width: 100%;
  text-align: end;
`;

const sectionFooterLink = css`
  text-decoration: none;
  color: ${colors.PRIMARY};

  &:visited {
    color: ${colors.PRIMARY};
  }
`;

export default Home;
