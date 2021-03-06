/** @jsxImportSource @emotion/react */

import React from "react";
import { useRedirectIfLoggedIn } from "../auth/hooks";
import { baseAppContainerWithoutTabs } from "../../styles/layout";
import Nav from "../../components/Header/Nav";
import { css } from "@emotion/react";
import { colors, textSizes } from "../../styles/variables";
import { Link } from "react-router-dom";
import { button } from "../../styles/components";

import topImage from "../../static/images/loren-dosti-M8cpBt6RSns-unsplash.webp";
import middleImage from "../../static/images/toa-heftiba-ANNsvl-6AG0-unsplash.webp";
import bottomImage from "../../static/images/zachary-nelson-98Elr-LIvD8-unsplash.webp";

/**
 * Pre-login home/index page component.
 */
function PreLogin() {
  useRedirectIfLoggedIn("/home");

  return (
    <div css={baseAppContainerWithoutTabs}>
      <Nav />
      <main css={main}>
        <div css={textContainer}>
          <p css={topText}>
            Welcome to the coolest language learning community ever!
          </p>
          <Link to="/register" css={joinButton}>
            Join Now
          </Link>
        </div>
        <div css={imageContainer}>
          <img
            src={topImage}
            alt="A team of rafters rowing in a body of water."
            css={image}
          />
          <div css={imageGradient} />
          <div css={imageQuoteContainer}>
            <p css={imageQuote}>
              Running water never grows stale. So you just have to 'keep on
              flowing.' <span css={imageQuoteAuthor}>Bruce Lee</span>
            </p>
          </div>
        </div>
        <div css={splitContainer}>
          <div css={splitTextContainer}>
            <p css={splitText}>
              Chat with native speakers of your target language who share your
              interests
            </p>
            <p css={disclaimer}>Users of this app might not always be real.</p>
          </div>
          <img
            src={middleImage}
            alt="A young person clad in urban attire, smiling."
            css={splitImage}
          />
        </div>
        <div css={splitContainer}>
          <img
            src={bottomImage}
            alt="Young people jumping and overall looking excited."
            css={splitImage}
          />
          <div css={splitTextContainer}>
            <p css={splitText}>Create channels and chat with other learners</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const main = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${colors.PRIMARY};
`;

const textContainer = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: ${colors.PRIMARY};
  color: ${colors.WHITE};

  @media (min-width: 1024px) {
    padding: 2rem 3.125rem;
  }
`;

const topText = css`
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
  background-color: ${colors.DARK_PRIMARY};

  &:active,
  &:hover,
  &:focus {
    background-color: ${colors.DARK};
  }
`;

const imageContainer = css`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "image";
`;

const image = css`
  width: 100%;
  min-height: 20rem;
  max-height: 60vh;
  object-fit: cover;
  display: block;
  user-select: none;
  user-drag: none;
  grid-area: image;
`;

const imageGradient = css`
  grid-area: image;
  background: linear-gradient(
    180deg,
    ${colors.PRIMARY}00 0%,
    ${colors.PRIMARY} 100%
  );
`;

const imageQuoteContainer = css`
  position: absolute;
  width: 100%;
  bottom: 0;
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
    content: "???";
  }
`;

const splitContainer = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: 1024px) {
    flex-direction: row-reverse;
  }
`;

const splitImage = css`
  ${image}

  @media (min-width: 1024px) {
    width: calc(100% / 1.618);
  }
`;

const splitTextContainer = css`
  ${textContainer};
  width: 100%;
  background-color: ${colors.DARK_PRIMARY};
`;

const splitText = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: ${colors.WHITE};
`;

export default PreLogin;
