import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import Nav from "../../common/components/Nav/Nav";
import SearchResultElement from "../../common/components/SearchResultElement";
import Tabs from "../../common/components/Tabs";
import { COLORS } from "../../common/constants";
import useAuth from "../../common/context/AuthContext/AuthContext";
import { homeSearchStyles } from "../../common/styles";

import { Helmet } from "react-helmet-async";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import { useIsDesktop } from "../../common/hooks";
import { homeSearchMain, homeSearchMainMobile } from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import { useChannelChatList, useFriendChatList } from "../chats/queries";
import RecentElement from "./components/RecentElement";
import { useDiscoverUsersList } from "./queries";

/**
 * Post-login home component.
 */
const HomePage = () => {
  const isDesktop = useIsDesktop();
  const transitionProps = useFadeIn();
  const { user } = useAuth();

  const { data: friendChats } = useFriendChatList();
  const { data: channelChats } = useChannelChatList();
  const { data: discoverUsers } = useDiscoverUsersList();

  const displayedFriendChats = friendChats?.slice(0, 6);
  const displayedChannelChats = channelChats?.slice(0, 6);
  const displayedDiscoverUsers = discoverUsers?.slice(0, 9);

  if (user == null) {
    return null;
  }

  return (
    <>
      <Helmet title="Home | LangFlow" />
      <ResponsiveBottomTabsLayout>
        <Nav />
        <main css={isDesktop ? homeSearchMain : homeSearchMainMobile}>
          <animated.header
            css={homeSearchStyles.header}
            style={transitionProps}
          >
            <h2 css={homeSearchStyles.h2}>Home</h2>
            <p>Welcome back, {user.username}</p>
          </animated.header>

          {/* 'Recent chats' section. Contains a list of the latest friend 
              chats. */}
          <animated.section
            css={homeSearchStyles.section}
            style={transitionProps}
          >
            <header>
              <h3 css={homeSearchStyles.sectionHeading}>Recent chats</h3>
            </header>
            <div css={homeSearchStyles.sectionItemsContainer}>
              {displayedFriendChats?.map((chat) => (
                <RecentElement
                  chatName={chat.name}
                  chatImage={chat.image}
                  lastMessageText={chat.messages[0].content}
                  lastMessageAuthorName={chat.messages[0].author.username}
                  isOwnMessage={chat.messages[0].author.id === user.id}
                  link={`/chats/${chat.id}`}
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

          {/* 'Your channels' section. Contains a list of the latest channel 
              chats. */}
          <animated.section
            css={homeSearchStyles.section}
            style={transitionProps}
          >
            <header>
              <h3 css={homeSearchStyles.sectionHeading}>Your channels</h3>
            </header>
            <div css={homeSearchStyles.sectionItemsContainer}>
              {displayedChannelChats?.map((chat) => (
                <RecentElement
                  chatName={chat.name}
                  chatImage={chat.image}
                  lastMessageText={chat.messages[0].content}
                  lastMessageAuthorName={chat.messages[0].author.username}
                  isOwnMessage={chat.messages[0].author.id === user.id}
                  link={`/chats/${chat.id}`}
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

          {/* 'Discover' section. Contains a list of randomized users, excluding
              friends of the user. */}
          <animated.section
            css={homeSearchStyles.section}
            style={transitionProps}
          >
            <header>
              <h3 css={homeSearchStyles.sectionHeading}>Discover</h3>
            </header>
            <div css={homeSearchStyles.sectionItemsContainer}>
              {displayedDiscoverUsers?.map((user) => (
                <SearchResultElement
                  id={user.id}
                  name={user.username}
                  languages={user.languages.map(({ language }) => language)}
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

        <Tabs />
      </ResponsiveBottomTabsLayout>
    </>
  );
};

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
