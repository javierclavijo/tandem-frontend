import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";

export const chatRoomCss = css`
  background-color: ${colors.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    grid-area: room;
    border-radius: 3px;
  }
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