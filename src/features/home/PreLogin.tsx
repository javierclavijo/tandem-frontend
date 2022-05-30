/** @jsxImportSource @emotion/react */

import React from "react";
import { useRedirectIfLoggedIn } from "../auth/hooks";
import { baseAppContainerWithoutTabs } from "../../styles/layout";
import Nav from "../../components/Header/Nav";
import { css } from "@emotion/react";
import { colors, textSizes } from "../../styles/variables";
import { Link } from "react-router-dom";
import { button } from "../../styles/components";

const topImage = require("../../static/images/loren-dosti-M8cpBt6RSns-unsplash.webp");

function PreLogin() {
  /**
   * Pre-login home/index page.
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
        <div css={imageContainer}>
          <img
            src={topImage}
            alt="A team of rafters rowing in a body of water."
            css={image}
          />
          <div css={imageQuoteContainer}>
            <p css={imageQuote}>
              Running water never grows stale. So you just have to 'keep on
              flowing.' <span css={imageQuoteAuthor}>Bruce Lee</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const upperContainer = css`
  min-height: 12rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background-color: ${colors.DARK_PRIMARY};
  color: ${colors.WHITE};
`;

const welcome = css`
  text-align: center;
  @media (min-width: 1024px) {
    font-size: ${textSizes.L};
  }
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

const imageContainer = css`
  width: 100%;
  position: relative;
`;

const image = css`
  width: 100%;
  min-height: 20rem;
  object-fit: cover;
  @media (min-width: 1024px) {
    object-fit: contain;
  }
`;

const imageQuoteContainer = css`
  position: absolute;
  width: 100%;
  bottom: 10%;
  background-color: ${colors.WHITE};
  color: ${colors.DARK_PRIMARY};
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;

  @media (min-width: 1024px) {
    font-size: ${textSizes.L};
    padding: 2rem 1rem;
  }
`;

const imageQuote = css`
  font-style: italic;
`;

const imageQuoteAuthor = css`
  font-style: normal;
  &:before {
    content: "―";
  }
`;

export default PreLogin;
