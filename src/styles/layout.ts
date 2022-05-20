import { css } from "@emotion/react";

export const baseAppContainer = css`
  // Main page layout
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
`;

export const baseAppContainerWithoutTabs = css`
  ${baseAppContainer};
  grid-template-rows: 5rem 1fr;
  grid-template-areas:
    "header"
    "main";
`;

export const baseAppContainerWithTabs = css`
  ${baseAppContainer};
  // Main page layout with tabs
  grid-template-rows: 5rem 1fr 3rem;
  grid-template-areas:
    "header"
    "main"
    "tabs";

  @media (min-width: 1025px) {
    // Set "tabs" area height to zero in desktop layout
    grid-template-rows: 5rem 1fr 0;
  }
`;
