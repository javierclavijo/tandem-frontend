/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {Cancel, Check, EditPencil} from "iconoir-react";
import {colors} from "../../styles/variables";

interface EditButtonProps {
    type: "enable" | "accept" | "cancel";
    visible: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>((
    {type, visible, onClick}: EditButtonProps,
    ref) => {
    return (
        <button ref={ref}
                onClick={onClick}
                css={css`${button};
                  ${!visible ?
                          `display: none;` : ``
                  }
                `}>
            {type === "enable" ?
                <EditPencil color={colors.WHITE} width={"1.5rem"} height={"1.5rem"}/> :
                type === "accept" ?
                    <Check color={colors.WHITE} width={"1.5rem"} height={"1.5rem"}/> :
                    <Cancel color={colors.WHITE} width={"1.5rem"} height={"1.5rem"}/>
            }
        </button>
    );
});

const button = css`
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default EditButton;
