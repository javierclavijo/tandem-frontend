/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {Cancel, Check, EditPencil} from "iconoir-react";
import {colors} from "../../styles/variables";

interface EditButtonProps {
    type: "enable" | "accept" | "cancel";
    onClickFn: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

function EditButton({type, onClickFn}: EditButtonProps) {
    return (
        <button
            onClick={onClickFn}
            css={css`
              border: none;
              background: none;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            `}>
            {type === "enable" ?
                <EditPencil color={colors.WHITE} width={"1.5rem"} height={"1.5rem"}/> :
                type === "accept" ?
                    <Check color={colors.WHITE} width={"1.5rem"} height={"1.5rem"}/> :
                    <Cancel color={colors.WHITE} width={"1.5rem"} height={"1.5rem"}/>
            }
        </button>
    );
}

export default EditButton;