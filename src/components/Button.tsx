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

const Button = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  (props: EditButtonProps, ref?) => {
    /*
     * Edit button component which allows visibility toggling, click event handling and ref forwarding.
     */

    return (
      <button
        ref={ref}
        onClick={props.onClick}
        css={css`
          ${buttonWithoutBackgroundAndBorder};
          ${props.css};
          ${!props.visible ? `display: none;` : ``}
        `}
      >
        {props.children}
      </button>
    );
  }
);

export default Button;
