/** @jsxImportSource @emotion/react */

import React from "react";
import { css, SerializedStyles } from "@emotion/react";
import { buttonWithoutBackgroundAndBorder } from "../styles/components";

interface EditButtonProps {
  visible: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  css?: SerializedStyles;
  children: JSX.Element | (JSX.Element | string)[] | string;
}

/*
 * Edit button component which allows visibility toggling, click event handling and ref forwarding.
 */
const Button = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  (props: EditButtonProps, ref?) => {
    const button = css`
      ${buttonWithoutBackgroundAndBorder};
      ${props.css};
      ${!props.visible ? `display: none;` : ``}
    `;
    return (
      <button ref={ref} onClick={props.onClick} css={button}>
        {props.children}
      </button>
    );
  }
);

export default Button;
