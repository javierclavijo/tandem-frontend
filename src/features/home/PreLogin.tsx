/** @jsxImportSource @emotion/react */

import React from "react";
import { useRedirectIfLoggedIn } from "../auth/hooks";
import { baseAppContainerWithoutTabs } from "../../styles/layout";
import Nav from "../../components/Header/Nav";
import { css } from "@emotion/react";
import { colors, textSizes } from "../../styles/variables";
import { Link } from "react-router-dom";
import { button } from "../../styles/components";

function PreLogin() {
  /**
   * Pre-login index page.
   */

  useRedirectIfLoggedIn("/home");

  return (
    <div css={baseAppContainerWithoutTabs}>
      <Nav />
      <main>
        <div css={upperContainer}>
          <p css={welcome}>
            Welcome to the coolest language learning community ever!
          </p>
          <Link to="/register" css={joinButton}>
            Join Now
          </Link>
          <p css={disclaimer}>Users of this app might not always be real.</p>
        </div>
      </main>
    </div>
  );
}

const upperContainer = css`
  min-height: 12rem;
  padding: 0 3.125rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background-color: ${colors.DARK_PRIMARY};
  color: ${colors.WHITE};
`;

const welcome = css`
  font-size: ${textSizes.L};
`;

const disclaimer = css`
  align-self: flex-end;
  font-size: ${textSizes.S};

  &:before {
    content: "*";
  }
`;

const joinButton = css`
  ${button};
  text-decoration: none;
  
  &:active,
  &:hover,
  &:focus {
    background-color: ${colors.DARK};
  }
`;

export default PreLogin;
