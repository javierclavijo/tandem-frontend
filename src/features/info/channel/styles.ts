import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";

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

export const membersSection = css`
  padding: 1rem;
  background-color: ${colors.WHITE};
  color: ${colors.DARK};

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const memberArticle = css`
  width: 100%;
  display: flex;
  gap: 1rem;
`;

export const memberImg = css`
  width: 3rem;
  border-radius: 50%;
`;