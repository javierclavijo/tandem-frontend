import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import Nav from "../../common/components/Nav/Nav";
import { COLORS } from "../../common/resources/style-variables";
import { useFadeIn } from "../../common/transitions";

/**
 * Component for the 404 error page.
 */
function NotFound() {
  const transitionProps = useFadeIn();

  return (
    <AnimatedLayout style={transitionProps}>
      <Nav />
      <main css={main}>
        <h2>Not found</h2>
        <p>We couldn&apos;t find what you&apos;re looking for.</p>
        <Link to="/" css={link}>
          Back to Home
        </Link>
      </main>
    </AnimatedLayout>
  );
}

const AnimatedLayout = animated(ResponsiveBottomTabsLayout);

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
