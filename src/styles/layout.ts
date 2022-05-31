import { css } from "@emotion/react";

export const baseAppContainer = css`
  // Main page layout
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  max-width: 100%;
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

  @media (min-width: 1024px) {
    // Set "tabs" area height to zero in desktop layout
    grid-template-rows: 5rem 1fr 0;
  }
`;

export const homeSearchMain = css`
  grid-area: main;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem 3.125rem;
  box-sizing: border-box;
  gap: 1rem;
  overflow: auto;
`;

export const homeSearchMainMobile = css`
  grid-area: main;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
`;
