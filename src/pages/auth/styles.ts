import { css } from "@emotion/react";
import { COLORS, FONT_SIZES } from "../../resources/style-variables";

export const main = css`
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 3.125rem;
`;

export const section = css`
  background-color: ${COLORS.WHITE};
  color: ${COLORS.PRIMARY};
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;
  width: calc(100% / 4);
  min-width: 20rem;
`;

export const header = css`
  font-weight: 400;
  font-size: ${FONT_SIZES.L};
  margin: 0 0 1rem 0;
  text-align: center;
`;

export const form = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export const label = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: ${FONT_SIZES.M};
  gap: 0.5rem;
`;

export const input = css`
  color: ${COLORS.DARK};
  width: 100%;
  border: none;
  border-bottom: 1px solid ${COLORS.PRIMARY};
  font-size: ${FONT_SIZES.M};
  padding-bottom: 0.5rem;

  &:focus {
    outline: none;
  }
`;

export const button = css`
  font-size: ${FONT_SIZES.M};
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  background-color: ${COLORS.PRIMARY};
  border: none;
  border-radius: 3px;
  color: ${COLORS.WHITE};
  cursor: pointer;

  transition: background-color 0.1s;
  &:active,
  &:hover,
  &:focus {
    background-color: ${COLORS.DARK_PRIMARY};
  }
`;

export const errorStyle = css`
  color: ${COLORS.CONTRAST};
  font-size: ${FONT_SIZES.S};
  margin: 0;
  width: 100%;
  text-align: start;
`;

export const link = css`
  color: ${COLORS.PRIMARY};

  &:visited {
    color: ${COLORS.PRIMARY};
  }
`;
