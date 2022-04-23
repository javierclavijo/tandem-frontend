/** @jsxImportSource @emotion/react */

import React from "react";
import {Channel} from "../../../entities/Channel";
import {useEdit} from "../hooks";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import {editElement} from "../channel/styles";
import EditButtons from "./EditButtons";

interface NameInputProps {
    data: Channel | undefined;
}

interface NameInputRequestData {
    description: string;
}

function NameInput({data}: NameInputProps) {

    const {
        editEnabled, setEditEnabled,
        value, setValue,
        error, setError, clearError,
        elementRef,
        submitButtonRef,
        handleChange,
        handleFocus,
        handleCancel,
    } = useEdit<HTMLInputElement>(data, "name");


    const handleSubmit = async () => {
        if (!value) {
            setError("Description must have a length between 1 and 2000 characters.");
            return false;
        }
        const requestData = {description: value};
        // await updateMutation.mutateAsync(requestData);
        setEditEnabled(false);
        return true;
    };

    return (
        <div css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}>
            <input type="text" id="name" name="name" ref={elementRef}
                   css={css`${editElement};
                     text-align: center;
                   `}
                   value={value}
                   onChange={handleChange}
                   onFocus={handleFocus}
            />
            <EditButtons editEnabled={editEnabled} submitButtonRef={submitButtonRef}
                         handleSubmit={handleSubmit} handleCancel={handleCancel}
            />

            {error ?
                <p css={css`
                  color: ${colors.CONTRAST};
                `}>
                    {error}
                </p> :
                null}
        </div>
    );
}

export default NameInput;
