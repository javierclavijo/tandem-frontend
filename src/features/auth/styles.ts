import { css } from "@emotion/react";
import { colors, textSizes } from "../../styles/variables";

export const main = css`
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 3.125rem;
`;

export const section = css`
  background-color: ${colors.WHITE};
  color: ${colors.PRIMARY};
  border-radius: 3px;
  padding: 1em;
  box-sizing: border-box;
  width: calc(100% / 4);
  min-width: 20rem;
`;

export const header = css`
  font-weight: 400;
  font-size: ${textSizes.L};
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
  font-size: ${textSizes.M};
`;

export const input = css`
  color: ${colors.DARK};
  width: 100%;
  border: none;
  border-bottom: 1px solid ${colors.PRIMARY};
  font-size: ${textSizes.M};
  padding: 0.5rem 0;

  &:focus {
    outline: none;
  }
`;

export const buttonCss = css`
  font-size: ${textSizes.M};
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  background-color: ${colors.PRIMARY};
  border: none;
  border-radius: 3px;
  color: ${colors.WHITE};
`;

export const errorCss = css`
  color: ${colors.CONTRAST};
  font-size: ${textSizes.S};
  margin: 0;
  width: 100%;
  text-align: start;
`;

export const link = css`
  color: ${colors.PRIMARY};

  &:visited {
    color: ${colors.PRIMARY};
  }
`;
