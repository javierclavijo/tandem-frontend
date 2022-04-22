/** @jsxImportSource @emotion/react */

import React, {useCallback} from "react";
import {Channel} from "../../entities/Channel";
import {useEdit} from "./hooks";
import {css} from "@emotion/react";
import {colors} from "../../styles/variables";
import {editElement} from "./channel/styles";

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
        handleChange,
        handleFocus,

    } = useEdit<HTMLInputElement>(data, "name");


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
