import { css } from "@emotion/react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import {
  baseAppContainerWithoutTabs,
  baseAppContainerWithTabs,
} from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import Nav from "../../components/Nav/Nav";
import { COLORS } from "../../resources/style-variables";

/**
 * Component for the 404 error page.
 */
function NotFound() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const transitionProps = useFadeIn();

  const container = css`
    ${isDesktop ? baseAppContainerWithoutTabs : baseAppContainerWithTabs};
    height: auto;
  `;

  return (
    <animated.div css={container} style={transitionProps}>
      <Nav />
      <main css={main}>
        <h2>Not found</h2>
        <p>We couldn&apos;t find what you&apos;re looking for.</p>
        <Link to="/" css={link}>
          Back to Home
        </Link>
      </main>
    </animated.div>
  );
}

const main = css`
  background-color: ${COLORS.WHITE};
  margin: 1rem 3.125rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  text-align: center;
  padding: 1rem;
`;

const link = css`
  text-decoration: none;
  color: ${COLORS.PRIMARY};

  &:visited {
    color: ${COLORS.PRIMARY};
  }
`;

export default NotFound;
