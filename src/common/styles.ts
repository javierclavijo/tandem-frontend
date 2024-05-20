import { css } from "@emotion/react";
import { COLORS, FONT_SIZES } from "./constants";

export const homeSearchMain = css`
  grid-area: main;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;

  @media (min-width: 1024px) {
    padding: 1rem 3.125rem;
    box-sizing: border-box;
  }
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

export const linkContainer = css`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "element";
`;

export const homeSearchStyles = {
  header: css`
    padding: 1rem;
    background-color: ${COLORS.WHITE};
    color: ${COLORS.DARK};
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,

  h2: css`
    color: ${COLORS.PRIMARY};
  `,

  section: css`
    height: auto;
    background-color: ${COLORS.WHITE};
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
  `,

  sectionHeading: css`
    color: ${COLORS.PRIMARY};
  `,

  sectionItemsContainer: css`
    display: grid;
    gap: 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  `,

  sectionFooter: css`
    width: 100%;
    text-align: end;
  `,

  sectionFooterLink: css`
    text-decoration: none;
    color: ${COLORS.PRIMARY};

    &:visited {
      color: ${COLORS.PRIMARY};
    }
  `,
};

export const searchInput = css`
  background-color: ${COLORS.LIGHT};
  display: flex;
  border-radius: 3px;
  transition: background-color 0.1s;

  &:hover {
    background-color: ${COLORS.SECONDARY}40;
  }
`;

export const searchInputElement = css`
  background: none;
  outline: none;
  border: none;
  flex: 1 1 auto;
  min-width: 4rem;
  font-size: ${FONT_SIZES.M};
`;
