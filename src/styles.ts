import { css } from "@emotion/react";
import { COLORS } from "./resources/style-variables";

const globalStyles = css`
  * {
    font-family: "Rubik", "sans-serif";
    margin: 0;
  }

  // Override normalize.css line-height rule, which in some cases causes elements to misalign.
  :where(html) {
    line-height: normal;
  }

  body {
    margin: 0;
    background-color: ${COLORS.LIGHT};
  }

  // Scrollbar styles
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    margin-block: 0.25rem;
  }

  ::-webkit-scrollbar-thumb {
    background: ${COLORS.PRIMARY};
    border-radius: 100vw;
  }

  // Firefox-specific scrollbar styles
  @supports (scrollbar-width: thin) {
    * {
      scrollbar-width: thin;
      scrollbar-color: ${COLORS.PRIMARY} ${COLORS.WHITE};
    }
  }

  @font-face {
    font-family: "Rubik";
    src: url("/fonts/Rubik/Rubik-VariableFont_wght.ttf") format("truetype");
    font-style: normal;
  }

  @font-face {
    font-family: "Rubik";
    src: url("/fonts/Rubik/Rubik-Italic-VariableFont_wght.ttf")
      format("truetype");
    font-style: italic;
  }
`;

export default globalStyles;
