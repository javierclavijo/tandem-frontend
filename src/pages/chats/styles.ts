import { css } from "@emotion/react";
import { COLORS, FONT_SIZES } from "../../common/resources/style-variables";
import { buttonWithoutBackgroundAndBorder } from "../../components/styles";

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
  background-color: ${COLORS.WHITE};
  width: 100%;
  position: relative;
`;

export const listContainerMobile = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
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

// TODO: substitute all this for CSS modules (also in other features)

export const infoSection = css`
  background-color: ${COLORS.DARK_PRIMARY};
  color: ${COLORS.WHITE};
  padding: 1rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const profileImg = css`
  width: 12rem;
  height: 12rem;
  max-width: 12rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const descriptionSection = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const languageItem = css`
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const listSection = css`
  padding: 1rem 0;
  background-color: ${COLORS.WHITE};
  color: ${COLORS.DARK};

  display: flex;
  flex-direction: column;
`;

export const listSectionHeader = css`
  padding-left: 1rem;
  padding-bottom: 1rem;
`;

export const listSectionList = css`
  list-style-type: none;
  padding: 0;
`;

export const infoListElementInnerContainer = css`
  width: 100%;
  display: flex;
  gap: 1rem;
  grid-area: element;
`;

export const infoListElementImg = css`
  width: 3rem;
  height: 3rem;
  object-fit: cover;
`;

export const editElement = css`
  width: 100%;
  height: fit-content;
  font-size: ${FONT_SIZES.M};
  resize: none;
  background: none;
  color: ${COLORS.WHITE};
  border: none;
  border-radius: 5px;

  transition: background-color 0.1s;

  // Add bottom border with 0 opacity to avoid resizing on focus
  border-bottom: 1px solid ${COLORS.PRIMARY}00;

  &:hover:not(:focus) {
    background: ${COLORS.SECONDARY}30;
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid ${COLORS.LIGHT};
    border-radius: 0;
  }
`;

export const buttonHover = css`
  color: ${COLORS.WHITE};
  border-bottom: 2px solid ${COLORS.SECONDARY}00;

  transition: border-bottom 0.1s;
  &:hover {
    border-bottom: 2px solid ${COLORS.SECONDARY}90;
  }
`;

export const infoButton = css`
  ${buttonWithoutBackgroundAndBorder};
  ${buttonHover};
  font-size: ${FONT_SIZES.S};
  height: fit-content;
  padding: 0.25rem;
`;
