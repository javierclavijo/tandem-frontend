import {css} from "@emotion/react";
import {colors, textSizes} from "../../../styles/variables";

export const infoSection = css`
  background-color: ${colors.PRIMARY};
  color: ${colors.WHITE};
  padding: 1rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const profileImg = css`
  width: 50%;
  max-width: 12rem;
  border-radius: 50%;
`;

export const descriptionSection = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const languageSection = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const languageItem = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const listSection = css`
  padding: 1rem;
  background-color: ${colors.WHITE};
  color: ${colors.DARK};

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const infoListElementArticle = css`
  width: 100%;
  display: flex;
  gap: 1rem;
`;

export const infoListElementImg = css`
  width: 3rem;
  border-radius: 50%;
`;

export const editElement = css`
  width: 100%;
  height: fit-content;
  font-size: ${textSizes.M};
  resize: none;
  background: none;
  color: ${colors.WHITE};
  border: none;

  // Add bottom border with 0 opacity to avoid resizing on focus
  border-bottom: 1px solid ${colors.PRIMARY}00;

  &:hover:not(:focus) {
    background: ${colors.WHITE}20;
    border-radius: 3px;
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid ${colors.LIGHT};
  }
`;
