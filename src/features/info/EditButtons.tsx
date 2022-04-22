/** @jsxImportSource @emotion/react */

import React from "react";
import EditButton from "./EditButton";
import {css} from "@emotion/react";

interface EditButtonsProps {
    editEnabled: boolean;
    submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    handleSubmit: () => Promise<boolean>;
    handleCancel: () => void;
}

function EditButtons({editEnabled, submitButtonRef, handleSubmit, handleCancel}: EditButtonsProps) {
    return (
        <div css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}>
            <EditButton type="accept" visible={editEnabled} onClick={handleSubmit}
                        ref={submitButtonRef}/>
            <EditButton type="cancel" visible={editEnabled} onClick={handleCancel}/>
        </div>
    );
}

export default EditButtons;
