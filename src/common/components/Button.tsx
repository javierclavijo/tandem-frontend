import React, { ReactNode } from "react";
import { StyledEmotionComponentProps } from "../types";
import { buttonWithoutBackgroundAndBorder } from "./styles";

interface EditButtonProps
  extends React.ClassAttributes<HTMLButtonElement>,
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    StyledEmotionComponentProps {
  children: ReactNode;
}

/*
 * Edit button component which allows visibility toggling, click event handling
 * and ref forwarding.
 */
const Button = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ ...props }: EditButtonProps, ref?) => {
    return (
      <button
        ref={ref}
        {...props}
        css={[buttonWithoutBackgroundAndBorder, props.css]}
      >
        {props.children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
