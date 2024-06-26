import { css } from "@emotion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../../common/components/Header/Header";
import { SimpleLayout } from "../../common/components/Layout";
import { COLORS, FONT_SIZES } from "../../common/constants";
import langflowLogo from "../../common/static/svg/langflow_logo.svg";
import bottomImage from "./static/images/pre-login-bottom.webp";
import middleImage from "./static/images/pre-login-middle.webp";
import topImage from "./static/images/pre-login-top.webp";

/**
 * Pre-login home/index page component.
 */
const PreLoginPage = () => (
  <>
    <PreLoginHelmet />
    <SimpleLayout>
      <Header />
      <main css={main}>
        <div css={textContainer}>
          <p css={topText}>
            Welcome to the coolest language learning community ever!
          </p>
          <Link to="/auth/register" css={joinButton}>
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
              Running water never grows stale. So you just have to &apos;keep on
              flowing.&apos; <span css={imageQuoteAuthor}>Bruce Lee</span>
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
            alt="Young people jumping and looking excited overall."
            css={splitImage}
          />
          <div css={splitTextContainer}>
            <p css={splitText}>Create channels and chat with other learners</p>
          </div>
        </div>
      </main>
    </SimpleLayout>
  </>
);

const PreLoginHelmet = () => (
  <Helmet>
    <title>LangFlow</title>
    <link
      rel="preload"
      fetchPriority="high"
      as="image"
      href={topImage}
      type="image/webp"
    />
    <link rel="preload" as="image" href={middleImage} type="image/webp" />
    <link rel="preload" as="image" href={bottomImage} type="image/webp" />
    <link rel="preload" as="image" href={langflowLogo} type="image/svg+xml" />
  </Helmet>
);

const main = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${COLORS.PRIMARY};
`;

const textContainer = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.WHITE};

  @media (min-width: 1024px) {
    padding: 2rem 3.125rem;
  }
`;

const topText = css`
  text-align: center;
  @media (min-width: 1024px) {
    font-size: ${FONT_SIZES.L};
  }
`;

const disclaimer = css`
  align-self: flex-end;
  font-size: ${FONT_SIZES.S};

  &:before {
    content: "*";
  }
`;

const joinButton = css`
  width: fit-content;
  padding: 0.5rem;
  border-radius: 3px;
  border: none;
  color: ${COLORS.WHITE};
  font-size: ${FONT_SIZES.M};
  cursor: pointer;
  transition: background-color 0.1s;
  text-decoration: none;
  background-color: ${COLORS.DARK_PRIMARY};

  &:active,
  &:hover,
  &:focus {
    background-color: ${COLORS.DARK};
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
  -webkit-user-drag: none;
  grid-area: image;
`;

const imageGradient = css`
  grid-area: image;
  background: linear-gradient(
    180deg,
    ${COLORS.PRIMARY}00 0%,
    ${COLORS.PRIMARY} 100%
  );
`;

const imageQuoteContainer = css`
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: ${COLORS.WHITE};
  color: ${COLORS.DARK_PRIMARY};
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;

  @media (min-width: 1024px) {
    font-size: ${FONT_SIZES.L};
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
  background-color: ${COLORS.DARK_PRIMARY};
`;

const splitText = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: ${COLORS.WHITE};
`;

export default PreLoginPage;
