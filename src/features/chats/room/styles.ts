import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";

export const chatRoomCss = css`
  grid-area: room;
  background-color: ${colors.WHITE};
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const chatRoomCssMobile = css`
  background-color: ${colors.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 8rem);
`;

export const chatRoomHeaderCss = css`
  height: 4.15rem;
  background-color: ${colors.PRIMARY};
  display: flex;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  color: ${colors.WHITE};
`;