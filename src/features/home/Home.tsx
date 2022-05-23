/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import { homeSearchStyles } from "../../styles/components";
import {
  baseAppContainerWithoutTabs,
  baseAppContainerWithTabs,
  homeSearchMain,
  homeSearchMainMobile,
} from "../../styles/layout";
import useAuth from "../auth/AuthContext";
import { useChannelChatList, useFriendChatList } from "../chats/hooks";
import SearchResultElement from "../search/SearchResultElement";
import { useDiscoverUsersList } from "./hooks";

function Home() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const { isLoggedIn, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
  }, [loading, isLoggedIn, navigate]);

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
        <header css={homeSearchStyles.header}>
          <h2 css={homeSearchStyles.h2}>Home</h2>
          <p>Welcome back, {user.username}</p>
        </header>

        {/* 'Recent chats' section. Contains a list of the latest friend chats. */}
        <section css={homeSearchStyles.section}>
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Recent chats</h3>
          </header>
          <div css={homeSearchStyles.sectionItemsContainer}>
            {friendChats?.slice(0, 6).map((chat) => (
              <SearchResultElement
                id={chat.id}
                name={chat.name}
                languages={[]}
                description={""}
                link={""}
              />
            ))}
          </div>
        </section>

        {/* 'Your channels' section. Contains a list of the latest channel chats. */}
        <section css={homeSearchStyles.section}>
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Your channels</h3>
          </header>
          <div css={homeSearchStyles.sectionItemsContainer}>
            {channelChats?.slice(0, 6).map((chat) => (
              <SearchResultElement
                id={chat.id}
                name={chat.name}
                languages={[]}
                description={""}
                link={""}
              />
            ))}
          </div>
        </section>

        {/* 'Discover' section. Contains a list of randomized users, excluding friends of the user. */}
        <section css={homeSearchStyles.section}>
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Discover</h3>
          </header>
          <div css={homeSearchStyles.sectionItemsContainer}>
            {discoverUsers?.slice(0, 9).map((user) => (
              <SearchResultElement
                id={user.id}
                name={user.username}
                languages={[]}
                description={""}
                link={""}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  ) : null;
}

export default Home;
