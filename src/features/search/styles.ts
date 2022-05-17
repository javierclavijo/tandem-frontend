import { css } from "@emotion/react";

export const searchMain = css`
  grid-area: main;
  height: 100%;
  max-height: 100%;
  min-height: 0;

  display: flex;
  flex-direction: column;

  gap: 1rem;
  padding: 1rem 3.125rem;
  box-sizing: border-box;
`;

export const searchMainMobile = css`
  grid-area: main;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
