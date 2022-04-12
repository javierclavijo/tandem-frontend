import {css} from "@emotion/react";
import {colors, textSizes} from "../../../styles/variables";

export const mainCss = css`
  grid-area: main;
  display: grid;
  grid-template-columns: minmax(20rem, 1fr) 2fr;
  grid-template-rows: calc(100vh - 7rem);
  grid-template-areas: "list room";

  gap: 1rem;
  padding: 1rem 0;
  box-sizing: border-box;
`;

export const listCss = css`
  grid-area: list;
  box-sizing: border-box;
  padding: 1rem 0 1rem 1rem;
  border-radius: 3px;
  display: flex;
  flex-direction: column;

  background-color: ${colors.WHITE};
  width: 100%;
`;

export const searchInputCss = css`
  width: 100%;
  font-size: ${textSizes.M};
  padding: 0.5rem;
  box-sizing: border-box;

  background-color: ${colors.LIGHT};
  color: ${colors.DARK};

  border-radius: 3px;
  border: none;

  &:focus {
    outline: none;
  }
`;

export const searchFormCss = css`
  padding: 0 1rem 1rem 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${colors.LIGHT};
`;

export const ulCss = css`
  list-style-type: none;
  padding: 0 1rem 0 0 ;
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

export const listElementCss = css`
  display: grid;
  border-bottom: 1px solid ${colors.LIGHT};
  color: ${colors.DARK};
  width: 100%;
`;

export const linkCss = css`
  grid-area: 1/1;
  z-index: 2;
`;

export const elementContentCss = css`
  grid-area: 1/1;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0;
  box-sizing: border-box;

  display: flex;
  gap: 0.75rem;
`;

export const imgCss = css`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const imageContainerCss = css`
  height: 3rem;
  width: 3rem;
  overflow: hidden;
  border-radius: 50%;
`;