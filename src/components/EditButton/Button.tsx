/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";

interface EditButtonProps {
    visible: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: JSX.Element | JSX.Element[] | string;
}

const Button = React.forwardRef<HTMLButtonElement, EditButtonProps>((
    props: EditButtonProps,
    ref?) => {
    /*
     * Edit button component which allows visibility toggling, click event handling and ref forwarding.
     */

    return (
        <button ref={ref}
                onClick={props.onClick}
                css={css`${buttonWithoutBackgroundAndBorder};
                  ${!props.visible ?
                          `display: none;` : ``
                  }
                `}>
            {props.children}
        </button>
    );
});

export const buttonWithoutBackgroundAndBorder = css`
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Button;
