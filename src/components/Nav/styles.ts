import {css} from "@emotion/react";
import {colors, textSizes} from "../../styles/variables";

export const headerCss = css`
  grid-area: header;
  height: 100%;
`;

export const navCss = css`
  height: 100%;
  background: ${colors.PRIMARY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 1rem;

  @media (min-width: 1025px) {
    padding: 0 3.125rem;
  }
`;

export const h1Css = css`
  color: ${colors.WHITE};
  margin: 0;
  font-size: ${textSizes.XL};
`;

export const ulCss = css`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style-type: none;
  gap: 20px;
`;

export const linkCss = css`
  text-decoration: none;
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
`;
