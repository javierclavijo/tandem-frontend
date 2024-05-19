import { css } from "@emotion/react";
import React, { ReactNode } from "react";
import { FONT_SIZES } from "../constants";
import { StyledEmotionComponentProps } from "../types";

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
  ({ children, ...props }: EditButtonProps, ref?) => (
    <button ref={ref} {...props} css={[button, props.css]}>
      {children}
    </button>
  ),
);

const button = css`
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

EditButton.displayName = "EditButton";

export default EditButton;
