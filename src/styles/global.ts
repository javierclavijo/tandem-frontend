import {css} from "@emotion/react";
import {colors} from "./variables";

export const globalStyles = css`
  * {
    font-family: 'Rubik', 'sans-serif';
    margin: 0;
  }

  body {
    margin: 0;
    background-color: ${colors.LIGHT};
  }

  // Scrollbar styles
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    margin-block: 0.25rem;
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.SECONDARY};
    border-radius: 100vw;
  }

  // Firefox-specific scrollbar styles
  @supports (scrollbar-width: thin) {
    * {
      scrollbar-width: thin;
      scrollbar-color: ${colors.SECONDARY} ${colors.WHITE};
    }
  }
`;
