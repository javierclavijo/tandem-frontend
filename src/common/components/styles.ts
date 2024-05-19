import { css } from "@emotion/react";
import { COLORS, FONT_SIZES } from "../constants";

// TODO: substitute all these css declarations with styled components or CSS
// modules.

export const buttonWithoutBackgroundAndBorder = css`
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 0.5rem;
  font-size: ${FONT_SIZES.S};
`;

export const thumbnailContainer = css`
  height: 3rem;
  width: 3rem;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

export const containerWithLink = css`
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
