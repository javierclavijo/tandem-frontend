/** @jsxImportSource @emotion/react */

import React from "react";
import {Channel} from "../../../entities/Channel";
import {useEdit} from "../hooks";
import {css} from "@emotion/react";
import {colors} from "../../../styles/variables";
import {editElement} from "../channel/styles";
import EditButtons from "./EditButtons";
import {axiosApi} from "../../auth/AuthContext";
import {useMutation, UseMutationResult, useQueryClient} from "react-query";
import {Chat} from "../../../entities/Chat";
import {User} from "../../../entities/User";

interface NameInputProps<T> {
    data: T;
    dataKey: keyof T;
    updateMutation: UseMutationResult<any, unknown, any, unknown>;
}

function NameInput<T>({data, dataKey, updateMutation}: NameInputProps<T>) {

    const {
        editEnabled, setEditEnabled,
        value,
        error, setError,
        elementRef,
        submitButtonRef,
        handleChange,
        handleFocus,
        handleCancel,
    } = useEdit<HTMLInputElement, T>(data, dataKey);


    const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        // If the submit button was clicked, submit the value. Else, cancel the editing.
        if (event.relatedTarget === submitButtonRef?.current) {
            const success = await handleSubmit();
            if (!success) {
                elementRef?.current?.focus();
            }
        } else if (event.relatedTarget) {
            // Check that the event has a related target to avoid resetting the field's value when the blur event is
            // caused by a keydown submit event.
            handleCancel();
        }
    };

    const handleSubmit = async () => {
        if (!value) {
            setError("Description must have a length between 1 and 2000 characters.");
            return false;
        }
        const requestData = {username: value};
        await updateMutation.mutateAsync(requestData);
        setEditEnabled(false);
        return true;
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        // If the Enter key is pressed, submit the form. If the pressed key is the Escape key, cancel the editing and blur the text area.
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
                   size={value.length}
                   css={css`${editElement};
                     text-align: center;
                     width: auto;
                     max-width: 100%;
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

export function ChannelNameInput({data}: { data: Channel }) {

    const queryClient = useQueryClient();

    const updateRequest = async (requestData: { username: string }) => {
        const response = await axiosApi.patch(data.url, requestData);
        return response.data;
    };

    const updateMutation = useMutation(updateRequest, {
        onSuccess: async (requestData) => {
            // Update chat data in all queries
            queryClient.setQueryData<Channel | undefined>(["users", "me"], (old) => {
                if (old) {
                    old.name = requestData.name;
                }
                return old;
            });
            queryClient.setQueryData<Chat[] | undefined>(["chats", "list"], (old) => {
                const oldChat = old?.find(chat => chat.id === requestData.id);
                if (oldChat) {
                    oldChat.name = requestData.name;
                }
                return old;
            });
            queryClient.setQueryData<Chat | undefined>(["chats", "detail", requestData.id], (old) => {
                if (old) {
                    old.name = requestData.name;
                }
                return old;
            });
        }
    });

    return <NameInput<Channel> data={data} dataKey="name" updateMutation={updateMutation}/>;

}


export function UserNameInput({data}: { data: User }) {

    const queryClient = useQueryClient();

    const updateRequest = async (requestData: { username: string }) => {
        const response = await axiosApi.patch(data.url, requestData);
        return response.data;
    };

    const updateMutation = useMutation(updateRequest, {
        onSuccess: async (requestData) => {
            // Update chat data in all queries
            queryClient.setQueryData<User | undefined>(["chats", "info", data?.id], (old) => {
                if (old) {
                    old.username = requestData.username;
                }
                return old;
            });
            queryClient.setQueryData<Chat[] | undefined>(["chats", "list"], (old) => {
                const oldChat = old?.find(chat => chat.id === requestData.id);
                if (oldChat) {
                    oldChat.name = requestData.name;
                }
                return old;
            });
            queryClient.setQueryData<Chat | undefined>(["chats", "detail", requestData.id], (old) => {
                if (old) {
                    old.name = requestData.name;
                }
                return old;
            });
        }
    });

    return <NameInput<User> data={data} dataKey="username" updateMutation={updateMutation}/>;

}