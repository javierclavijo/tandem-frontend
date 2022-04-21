/** @jsxImportSource @emotion/react */

import React, {useCallback} from "react";
import {Channel} from "../../entities/Channel";
import {css} from "@emotion/react";
import EditButton from "./EditButton";
import {colors, textSizes} from "../../styles/variables";
import TextareaAutosize from "react-textarea-autosize";
import useAuth, {axiosApi} from "../auth/AuthContext";
import {useMutation, useQueryClient} from "react-query";

interface DescriptionProps {
    channelData: Channel | undefined;
}

interface DescriptionUpdateData {
    description: string;
}

function Description({channelData}: DescriptionProps) {
    const {user} = useAuth();
    const queryClient = useQueryClient();

    const [editable, setEditable] = React.useState<boolean>(false);
    const [editEnabled, setEditEnabled] = React.useState<boolean>(false);
    const [inputValue, setInputValue] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const submitButtonRef = React.useRef<HTMLButtonElement>(null);


    React.useEffect(() => setEditable(
        // Check if the user has admin role, set the 'editable' state accordingly
        !!channelData?.memberships.some(membership =>
            membership.user?.id === user?.id && membership.role === "Administrator"
        )), [channelData?.memberships, user]);


    const updateRequest = async (requestData: DescriptionUpdateData) => {
        const response = await axiosApi.patch(`/channels/${channelData?.id}/`, requestData);
        return response.data;
    };

    const updateMutation = useMutation(updateRequest, {
        onSuccess: async (data) => {
            queryClient.setQueryData<Channel | undefined>(["chats", "info", channelData?.id], (old) => {
                if (old) {
                    old.description = data.description;
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
        if (channelData?.description) {
            setInputValue(channelData.description);
        }
    }, [channelData?.description]);

    // Set data on init and whenever data changes (i.e. after submitting)
    React.useEffect(updateInputValue, [channelData?.description]);


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
                textareaRef.current?.focus();
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
                textareaRef.current?.blur();
            } else {
                event.preventDefault();
            }

        } else if (event.code === "Escape") {
            handleCancel();
            textareaRef.current?.blur();
        }
    };


    return editable ?
        <React.Fragment>
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
            <TextareaAutosize id="description" name="description" ref={textareaRef}
                              value={inputValue}
                              onChange={handleChange}
                              onFocus={handleFocus}
                              onBlur={handleBlur}
                              onKeyDown={handleKeyDown}
                              minRows={1} maxRows={8}
                              css={textarea}/>
            {error ?
                <p css={css`
                  color: ${colors.CONTRAST};
                `}>
                    {error}
                </p> :
                null}
        </React.Fragment> :
        <React.Fragment>
            <h3>Description</h3>
            <p>{channelData?.description}</p>
        </React.Fragment>
        ;
}


const textarea = css`
  width: 100%;
  height: fit-content;
  font-size: ${textSizes.M};
  resize: none;
  background: none;
  color: ${colors.WHITE};
  border: none;

  // Add bottom border with 0 opacity to avoid resizing on focus
  border-bottom: 1px solid ${colors.PRIMARY}00;

  &:hover:not(:focus) {
    background: ${colors.WHITE}20;
    border-radius: 3px;
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid ${colors.LIGHT};
  }
`;

export default Description;
