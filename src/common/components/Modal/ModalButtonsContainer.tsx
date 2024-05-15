import { css } from "@emotion/react";
import React, { ReactNode } from "react";
import { StyledEmotionComponentProps } from "../../types";

interface ModalButtonsContainerProps
  extends React.ClassAttributes<HTMLDivElement>,
    React.ButtonHTMLAttributes<HTMLDivElement>,
    StyledEmotionComponentProps {
  children: ReactNode;
}

/*
 * Modal title component.
 */
const ModalButtonsContainer = React.forwardRef<
  HTMLDivElement,
  ModalButtonsContainerProps
>(({ ...props }: ModalButtonsContainerProps, ref?) => {
  return (
    <div ref={ref} {...props} css={[buttonsContainer, props.css]}>
      {props.children}
    </div>
  );
});

const buttonsContainer = css`
  display: flex;
  gap: 1rem;
`;

ModalButtonsContainer.displayName = "ModalButtonsContainer";

export default ModalButtonsContainer;
