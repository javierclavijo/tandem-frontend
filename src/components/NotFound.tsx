/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Link, To } from "react-router-dom";
import {
  baseAppContainerWithoutTabs,
  baseAppContainerWithTabs,
  homeSearchMain,
  homeSearchMainMobile,
} from "../styles/layout";
import { colors } from "../styles/variables";
import Nav from "./Nav";

function NotFound() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const container = css`
    ${isDesktop ? baseAppContainerWithoutTabs : baseAppContainerWithTabs};
    height: auto;
  `;

  return (
    <div css={container}>
      <Nav />
      <main css={main}>
        <h2>Not found</h2>
        <p>We couldn't find what you're looking for.</p>
        <Link to={-1 as To} css={link}>
          Go back?
        </Link>
      </main>
    </div>
  );
}

const main = css`
  background-color: ${colors.WHITE};
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
  color: ${colors.PRIMARY};

  &:visited {
    color: ${colors.PRIMARY};
  }
`;

export default NotFound;
