import { css } from "@emotion/react";
import React, { ReactNode } from "react";
import { COLORS } from "../../constants";
import { StyledEmotionComponentProps } from "../../types";

interface ModalTitleProps
  extends React.ClassAttributes<HTMLParagraphElement>,
    React.ButtonHTMLAttributes<HTMLParagraphElement>,
    StyledEmotionComponentProps {
  children: ReactNode;
}

/*
 * Modal title component.
 */
const ModalTitle = React.forwardRef<HTMLParagraphElement, ModalTitleProps>(
  ({ children, ...props }: ModalTitleProps, ref?) => (
    <p ref={ref} {...props} css={[title, props.css]}>
      {children}
    </p>
  ),
);

const title = css`
  margin-bottom: 1rem;
  color: ${COLORS.DARK};
`;

ModalTitle.displayName = "ModalTitle";

export default ModalTitle;
