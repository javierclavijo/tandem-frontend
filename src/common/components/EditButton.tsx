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
 * Edit button component.
 */
const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ children, ...props }: EditButtonProps, ref?) => {
    return (
      <button
        ref={ref}
        {...props}
        css={[buttonWithoutBackgroundAndBorder, props.css]}
      >
        {children}
      </button>
    );
  },
);

EditButton.displayName = "EditButton";

export default EditButton;
