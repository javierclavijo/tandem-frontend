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
};

export const modalButton = css`
  width: fit-content;
  padding: 0.5rem;
  border-radius: 3px;
  border: none;
  background-color: ${colors.PRIMARY};
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
  cursor: pointer;
`;
