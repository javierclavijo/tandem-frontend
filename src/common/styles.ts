import { css } from "@emotion/react";

export const homeSearchMain = css`
  grid-area: main;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem 3.125rem;
  box-sizing: border-box;
  gap: 1rem;
  overflow: auto;
`;

export const homeSearchMainMobile = css`
  grid-area: main;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
`;

export const visuallyHidden = css`
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  // Source: https://webaim.org/techniques/css/invisiblecontent/
`;
