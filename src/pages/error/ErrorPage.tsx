import { css } from "@emotion/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import Nav from "../../common/components/Nav/Nav";
import { COLORS } from "../../common/constants";
import { useFadeIn } from "../../common/transitions";

interface ErrorPageProps {
  title: string;
  heading: string;
  description: string;
}

/**
 * Base error page.
 */
export function BaseErrorPage({ title, heading, description }: ErrorPageProps) {
  const transitionProps = useFadeIn();

  return (
    <>
      <Helmet title={title} />
      <AnimatedLayout style={transitionProps}>
        <Nav />
        <main css={main}>
          <h2>{heading}</h2>
          <p>{description}</p>
          <Link to="/" css={link}>
            Back to Home
          </Link>
        </main>
      </AnimatedLayout>
    </>
  );
}

/**
 * Generic error page. Used in the app's router, plus an error boundary
 * wrapping the app.
 */
function ErrorPage() {
  return (
    <BaseErrorPage
      title="Error | LangFlow"
      heading="Oops!"
      description="An error happened."
    />
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

export default ErrorPage;
