/** @jsxImportSource @emotion/react */

import React from "react";
import Button from "./Button";
import {css} from "@emotion/react";
import {Cancel, Check} from "iconoir-react";

interface EditButtonsProps {
    editEnabled: boolean;
    submitButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
    handleSubmit: () => Promise<boolean>;
    handleCancel: () => void;
    color: string;
}

function EditButtons({editEnabled, submitButtonRef, handleSubmit, handleCancel, color}: EditButtonsProps) {
    return (
        <div css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}>
            <Button visible={editEnabled} onClick={handleSubmit} ref={submitButtonRef}>
                <Check color={color} width={"1.5rem"} height={"1.5rem"}/>
            </Button>
            <Button visible={editEnabled} onClick={handleCancel}>
                <Cancel color={color} width={"1.5rem"} height={"1.5rem"}/>
            </Button>
        </div>
    );
}

export default EditButtons;
