/** @jsxImportSource @emotion/react */

import React, {useCallback} from "react";
import {Channel} from "../../entities/Channel";
import {css} from "@emotion/react";
import EditButton from "./EditButton";
import {colors} from "../../styles/variables";
import TextareaAutosize from "react-textarea-autosize";
import {axiosApi} from "../auth/AuthContext";
import {useMutation, useQueryClient} from "react-query";
import {useEdit} from "./hooks";
import {editElement} from "./channel/styles";

interface DescriptionTextareaProps {
    data: Channel | undefined;
}

interface DescriptionTextareaRequestData {
    description: string;
}


function DescriptionTextarea({data}: DescriptionTextareaProps) {
    const queryClient = useQueryClient();

    const {
        editEnabled, setEditEnabled,
        inputValue, setInputValue,
        error, setError,
        elementRef
    } = useEdit<HTMLTextAreaElement>();

    const submitButtonRef = React.useRef<HTMLButtonElement>(null);


    const updateRequest = async (requestData: DescriptionTextareaRequestData) => {
        const response = await axiosApi.patch(`/channels/${data?.id}/`, requestData);
        return response.data;
    };

    const updateMutation = useMutation(updateRequest, {
        onSuccess: async (requestData) => {
            queryClient.setQueryData<Channel | undefined>(["chats", "info", data?.id], (old) => {
                if (old) {
                    old.description = requestData.description;
                }
                return old;
            });
        }
    });


    const clearError = () => {
        if (error) {
            setError("");
        }
    };

    const updateInputValue = useCallback(() => {
        if (data?.description) {
            setInputValue(data.description);
        }
    }, [data?.description]);

    // Set data on init and whenever data changes (i.e. after submitting)
    React.useEffect(updateInputValue, [data?.description]);


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        clearError();
        setInputValue(e.target.value);
    };

    const handleFocus = () => {
        setEditEnabled(true);
        clearError();
    };


    const handleBlur = async (event: React.FocusEvent<HTMLTextAreaElement>) => {
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
        if (!inputValue) {
            setError("Description must have a length between 1 and 2000 characters.");
            return false;
        }
        const requestData = {description: inputValue};
        await updateMutation.mutateAsync(requestData);
        setEditEnabled(false);
        return true;
    };

    const handleCancel = () => {
        updateInputValue();
        setEditEnabled(false);
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // If the Meta or Control key is pressed at the same time as the Enter key, submit the form. If the pressed key
        // is the Escape key, cancel the editing and blur the text area.
        if (event.metaKey || event.ctrlKey && event.code === "Enter") {
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


    return <React.Fragment>
        <div css={css`
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          height: 1.5rem;
        `}>
            <h3>Description</h3>
            <React.Fragment>
                <EditButton type="accept" visible={editEnabled} onClick={handleSubmit}
                            ref={submitButtonRef}/>
                <EditButton type="cancel" visible={editEnabled} onClick={handleCancel}/>
            </React.Fragment>
        </div>
        <TextareaAutosize id="description" name="description" ref={elementRef}
                          value={inputValue}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          minRows={1} maxRows={8}
                          css={editElement}/>
        {error ?
            <p css={css`
              color: ${colors.CONTRAST};
            `}>
                {error}
            </p> :
            null}
    </React.Fragment>
        ;
}


export default DescriptionTextarea;
