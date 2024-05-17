import { css } from "@emotion/react";
import React, { ReactNode } from "react";
import { COLORS, FONT_SIZES } from "../resources/style-variables";
import { StyledEmotionComponentProps } from "../types";

interface ButtonProps
  extends React.ClassAttributes<HTMLButtonElement>,
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    StyledEmotionComponentProps {
  children: ReactNode;
}

/*
 * Generic button component.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }: ButtonProps, ref?) => {
    return (
      <button ref={ref} {...props} css={[button, props.css]}>
        {children}
      </button>
    );
  },
);

const button = css`
  width: fit-content;
  padding: 0.5rem;
  border-radius: 3px;
  border: none;
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.WHITE};
  font-size: ${FONT_SIZES.M};
  cursor: pointer;

  transition: background-color 0.1s;

  &:active,
  &:hover,
  &:focus {
    background-color: ${COLORS.DARK_PRIMARY};
  }
`;

Button.displayName = "Button";

export default Button;
