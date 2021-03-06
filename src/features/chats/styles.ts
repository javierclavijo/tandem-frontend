import { css } from "@emotion/react";
import { colors } from "../../styles/variables";

export const chatMain = css`
  grid-area: main;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(20rem, 1fr) 2fr;
  grid-template-rows: calc(100vh - 7rem);
  grid-template-areas: "list room";

  gap: 1rem;
  padding: 1rem 3.125rem;
  box-sizing: border-box;
`;

export const chatMainMobile = css`
  grid-area: main;
  max-height: 100%;
  min-height: 0;
`;

export const listContainer = css`
  grid-area: list;
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  background-color: ${colors.WHITE};
  width: 100%;
  position: relative;
`;

export const listContainerMobile = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${colors.WHITE};
  width: 100%;
  max-height: calc(100vh - 8rem);
  position: relative;
`;

export const listElementContainerCss = css`
  list-style-type: none;
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 0 0 1rem 0;
  list-style-type: none;
`;

export const link = css`
  grid-area: 1/1;
  z-index: 2;
`;

export const elementContentContainer = css`
  grid-area: 1/1;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0;
  box-sizing: border-box;
  display: flex;
  gap: 0.75rem;
`;
