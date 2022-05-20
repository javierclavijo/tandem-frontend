/** @jsxImportSource @emotion/react */

import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import { homeSearchStyles } from "../../styles/components";
import {
  baseAppContainerWithoutTabs,
  baseAppContainerWithTabs,
  homeSearchMain,
  homeSearchMainMobile
} from "../../styles/layout";
import useAuth from "../auth/AuthContext";

function Home() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const { isLoggedIn, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
  }, [loading, isLoggedIn, navigate]);

  return isLoggedIn && user ? (
    <div
      css={isDesktop ? baseAppContainerWithoutTabs : baseAppContainerWithTabs}
    >
      <Nav />
      <main css={isDesktop ? homeSearchMain : homeSearchMainMobile}>
        <header css={homeSearchStyles.header}>
          <h2 css={homeSearchStyles.h2}>Home</h2>
          <p>Welcome back, {user.username}</p>
        </header>
        <section css={homeSearchStyles.section}>
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Recent chats</h3>
          </header>
        </section>
        <section css={homeSearchStyles.section}>
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Your channels</h3>
          </header>
        </section>
        <section css={homeSearchStyles.section}>
          <header>
            <h3 css={homeSearchStyles.sectionHeading}>Discover</h3>
          </header>
        </section>
      </main>
    </div>
  ) : null;
}

export default Home;
