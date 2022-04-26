/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {Cancel, Check, EditPencil} from "iconoir-react";

interface EditButtonProps {
    type: "enable" | "accept" | "cancel";
    visible: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    color: string;
}

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>((
    {type, visible, onClick, color}: EditButtonProps,
    ref?) => {
    // Edit button component with properties which allows visibility toggling, click event handling and ref forwarding.

    return (
        <button ref={ref}
                onClick={onClick}
                css={css`${buttonWithoutBackgroundAndBorder};
                  ${!visible ?
                          `display: none;` : ``
                  }
                `}>
            {type === "enable" ?
                <EditPencil color={color} width={"1.5rem"} height={"1.5rem"}/> :
                type === "accept" ?
                    <Check color={color} width={"1.5rem"} height={"1.5rem"}/> :
                    <Cancel color={color} width={"1.5rem"} height={"1.5rem"}/>
            }
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

export default EditButton;
