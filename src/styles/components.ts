import { css } from "@emotion/react";
import { StylesConfig } from "react-select";
import { colors, textSizes } from "./variables";

export const badge = css`
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: fit-content;
  height: 2rem;
`;

export const select: StylesConfig = {
  // Styles for react-select component
  menu: (provided) => ({
    ...provided,
    width: "max-content",
    minWidth: "100%",
  }),
};

export const searchSelect: StylesConfig = {
  // Styles for react-select component
  menu: (provided) => ({
    ...provided,
    width: "max-content",
    minWidth: "100%",
  }),
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
};

export const noBorderAndBgSelectWhite: StylesConfig = {
  // Styles for react-select component
  menu: (provided) => ({
    ...provided,
    width: "max-content",
    minWidth: "100%",
    color: colors.DARK,
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "none",
    border: "none",
    boxShadow: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: colors.WHITE,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: colors.WHITE,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
};

export const noBorderAndBgSelectDark: StylesConfig = {
  ...noBorderAndBgSelectWhite,
  dropdownIndicator: (provided) => ({
    ...provided,
    color: colors.DARK,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: colors.DARK,
  }),
  container: (provided) => ({
    ...provided,
    flex: "1 0 auto",
  }),
};

export const modal = {
  container: {
    content: {
      margin: "auto",
      width: "fit-content",
      height: "fit-content",
      overflow: "visible",
      padding: "1.25rem",
    },
    overlay: {
      zIndex: 100,
    },
  },

  title: css`
    margin-bottom: 1rem;
    color: ${colors.DARK};
  `,

  buttonsContainer: css`
    display: flex;
    gap: 1rem;
  `,

  button: css`
    width: fit-content;
    padding: 0.5rem;
    border-radius: 3px;
    border: none;
    background-color: ${colors.PRIMARY};
    color: ${colors.WHITE};
    font-size: ${textSizes.M};
    cursor: pointer;

    transition: background-color 0.1s;
    &:active {
      background-color: ${colors.DARK};
    }
  `,

  cancelButton: css`
    width: fit-content;
    padding: 0.5rem;
    border-radius: 3px;
    border: none;
    background-color: ${colors.PRIMARY};
    color: ${colors.WHITE};
    font-size: ${textSizes.M};
    cursor: pointer;
    background-color: ${colors.DARK}60;

    transition: background-color 0.1s;
    &:active {
      background-color: ${colors.DARK};
    }
  `,
};

export const buttonWithoutBackgroundAndBorder = css`
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 0.5rem;
  font-size: ${textSizes.S};
`;

export const thumbnailImg = css`
  height: 100%;
  width: 100%;
  object-fit: cover;
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
    background-color: ${colors.WHITE};
    color: ${colors.DARK};
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,

  h2: css`
    color: ${colors.PRIMARY};
  `,

  section: css`
    height: auto;
    background-color: ${colors.WHITE};
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
  `,

  sectionHeading: css`
    color: ${colors.PRIMARY};
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
  background-color: ${colors.LIGHT};
  display: flex;
  border-radius: 3px;
  transition: background-color 0.1s;

  &:hover {
    background-color: ${colors.SECONDARY}40;
  }
`;
