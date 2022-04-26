/** @jsxImportSource @emotion/react */

import React from "react";
import EditButton from "./EditButton";
import {css} from "@emotion/react";

interface EditButtonsProps {
    editEnabled: boolean;
    submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    handleSubmit: () => Promise<boolean>;
    handleCancel: () => void;
    color:string;
}

function EditButtons({editEnabled, submitButtonRef, handleSubmit, handleCancel, color}: EditButtonsProps) {
    return (
        <div css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}>
            <EditButton type="accept" visible={editEnabled} onClick={handleSubmit}
                        ref={submitButtonRef} color={color}/>
            <EditButton type="cancel" visible={editEnabled} onClick={handleCancel} color={color}/>
        </div>
    );
}

export default EditButtons;
