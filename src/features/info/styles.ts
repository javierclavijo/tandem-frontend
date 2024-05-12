import { css } from "@emotion/react";
import { buttonWithoutBackgroundAndBorder } from "../../styles/components";
import { colors, textSizes } from "../../styles/variables";

export const infoSection = css`
  background-color: ${colors.DARK_PRIMARY};
  color: ${colors.WHITE};
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
  background-color: ${colors.WHITE};
  color: ${colors.DARK};

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
  font-size: ${textSizes.M};
  resize: none;
  background: none;
  color: ${colors.WHITE};
  border: none;
  border-radius: 5px;

  transition: background-color 0.1s;

  // Add bottom border with 0 opacity to avoid resizing on focus
  border-bottom: 1px solid ${colors.PRIMARY}00;

  &:hover:not(:focus) {
    background: ${colors.SECONDARY}30;
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid ${colors.LIGHT};
    border-radius: 0;
  }
`;

export const buttonHover = css`
  color: ${colors.WHITE};
  border-bottom: 2px solid ${colors.SECONDARY}00;

  transition: border-bottom 0.1s;
  &:hover {
    border-bottom: 2px solid ${colors.SECONDARY}90;
  }
`;

export const infoButton = css`
  ${buttonWithoutBackgroundAndBorder};
  ${buttonHover};
  font-size: ${textSizes.S};
  height: fit-content;
  padding: 0.25rem;
`;
