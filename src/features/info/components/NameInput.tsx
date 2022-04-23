/** @jsxImportSource @emotion/react */

import React from "react";
import {Channel} from "../../../entities/Channel";
import {useEdit} from "../hooks";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import {editElement} from "../channel/styles";
import EditButtons from "./EditButtons";
import {axiosApi} from "../../auth/AuthContext";
import {useMutation, useQueryClient} from "react-query";

interface NameInputProps {
    data: Channel | undefined;
}

interface NameInputRequestData {
    name: string;
}

function NameInput({data}: NameInputProps) {

    const queryClient = useQueryClient();

    const {
        editEnabled, setEditEnabled,
        value,
        error, setError,
        elementRef,
        submitButtonRef,
        handleChange,
        handleFocus,
        handleCancel,
    } = useEdit<HTMLInputElement>(data, "name");


    const updateRequest = async (requestData: NameInputRequestData) => {
        const response = await axiosApi.patch(`/channels/${data?.id}/`, requestData);
        return response.data;
    };

    const updateMutation = useMutation(updateRequest, {
        onSuccess: async (requestData) => {
            queryClient.setQueryData<Channel | undefined>(["chats", "info", data?.id], (old) => {
                if (old) {
                    old.name = requestData.name;
                }
                return old;
            });
        }
    });


    const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        // If the submit button was clicked, submit the value. Else, cancel the editing.
        if (event.relatedTarget === submitButtonRef?.current) {
            const success = await handleSubmit();
            if (!success) {
                elementRef?.current?.focus();
            }
        } else {
            handleCancel();
        }
    };

    const handleSubmit = async () => {
        if (!value) {
            setError("Description must have a length between 1 and 2000 characters.");
            return false;
        }
        const requestData = {name: value};
        await updateMutation.mutateAsync(requestData);
        setEditEnabled(false);
        return true;
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        // If the Meta or Control key is pressed at the same time as the Enter key, submit the form. If the pressed key
        // is the Escape key, cancel the editing and blur the text area.
        if (event.code === "Enter") {
            const success = await handleSubmit();
            if (success) {
                elementRef.current?.blur();
            } else {
                event.preventDefault();
            }

        } else if (event.code === "Escape") {
            handleCancel();
            elementRef.current?.blur();
        }
    };


    return (
        <div css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}>
            <input type="text" id="name" name="name" ref={elementRef}
                   value={value}
                   onChange={handleChange}
                   onFocus={handleFocus}
                   onBlur={handleBlur}
                   onKeyDown={handleKeyDown}
                   css={css`${editElement};
                     text-align: center;
                   `}
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
