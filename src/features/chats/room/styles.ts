import { css } from "@emotion/react";
import { colors } from "../../../styles/variables";

export const chatRoom = css`
  grid-area: room;
  background-color: ${colors.WHITE};
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const chatRoomMobile = css`
  background-color: ${colors.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 0;
  height: 100%;
`;

export const chatHeader = css`
  min-height: 4.15rem;
  max-height: 100%;
  background-color: ${colors.DARK_PRIMARY};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  color: ${colors.WHITE};
`;
