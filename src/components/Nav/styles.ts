import {css} from "@emotion/react";
import {colors, textSizes} from "../../styles/variables";

export const navCss = css`
  background: ${colors.PRIMARY};
  display: flex;
  justify-content: space-between;
  padding: 20px 50px;
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
