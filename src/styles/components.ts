import {css} from "@emotion/react";
import {StylesConfig} from "react-select";
import {colors} from "./variables";

export const badge = css`
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: fit-content;
`;

export const select: StylesConfig = {
    // Styles for react-select component
    menu: (provided) => ({
        ...provided,
        width: "max-content",
        minWidth: "100%"
    }),
};

export const badgeSelect: StylesConfig = {
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
        color: colors.WHITE
    }),
    singleValue: (provided) => ({
        ...provided,
        color: colors.WHITE
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: "none",
    }),
};
