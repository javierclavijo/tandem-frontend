import { css } from "@emotion/react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import EditButtons from "../../../components/EditButtons";
import { colors } from "../../../styles/variables";
import { axiosApi } from "../../auth/AuthContext";
import { Channel, Chat, User } from "../../common/types";
import { editElement } from "../styles";
import { useEditField } from "./hooks";

interface NameInputProps<TData> {
  data: TData;
  dataKey: keyof TData;
  onSubmit: (value: string) => Promise<void>;
}

/**
 * Base name input component for detail views.
 */
function NameInput<TData>({ data, dataKey, onSubmit }: NameInputProps<TData>) {
  const {
    editEnabled,
    setEditEnabled,
    value,
    error,
    setError,
    elementRef,
    submitButtonRef,
    handleChange,
    handleFocus,
    handleCancel,
  } = useEditField<HTMLInputElement, TData>(data, dataKey);

  // Used in handleBlur() to handle the case of submitting through keyboard.
  const keyboardSubmitRef = React.useRef<boolean>(false);

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    // If the submit button was clicked, submit the value. Else, cancel the editing.
    if (event.relatedTarget === submitButtonRef?.current) {
      const success = await handleSubmit();
      if (!success) {
        elementRef?.current?.focus();
      }
    } else if (keyboardSubmitRef.current) {
      // If the blur event was dispatched by the keyboard submit handler, just set 'enabled' to false.
      keyboardSubmitRef.current = false;
      setEditEnabled(false);
    } else {
      handleCancel();
    }
  };

  const handleSubmit = async () => {
    if (!value) {
      setError("Name must have a length between 1 and 50 characters.");
      return false;
    }
    onSubmit(value);
    setEditEnabled(false);
    return true;
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // If the Enter key is pressed, submit the form. If the pressed key is the Escape key, cancel the editing and
    // blur the text area.
    if (event.code === "Enter") {
      const success = await handleSubmit();
      if (success) {
        keyboardSubmitRef.current = true;
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
    <React.Fragment>
      <div css={container}>
        <input
          type="text"
          id="name"
          name="name"
          ref={elementRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          size={value.length}
          css={input}
        />
        <EditButtons
          editEnabled={editEnabled}
          submitButtonRef={submitButtonRef}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          color={colors.WHITE}
        />
      </div>

      {error ? <p css={errorText}>{error}</p> : null}
    </React.Fragment>
  );
}

/**
 * Name input component for channel detail.
 */
export function ChannelNameInput({ data }: { data: Channel }) {
  const queryClient = useQueryClient();

  const updateRequest = async (requestData: { name: string }) => {
    const response = await axiosApi.patch(data.url, requestData);
    return response.data;
  };

  const updateMutation = useMutation(updateRequest, {
    onSuccess: async (requestData) => {
      // Update chat data in the channel's detail query, and also in the chat list and chat detail queries, to
      // update the header and the chat list
      queryClient.setQueryData<Channel | undefined>(
        ["channels", data?.id],
        (old) => {
          if (old) {
            old.name = requestData.name;
          }
          return old;
        },
      );
      queryClient.setQueryData<Chat[] | undefined>(
        ["chats", "list", "all"],
        (old) => {
          const oldChat = old?.find((chat) => chat.id === requestData.id);
          if (oldChat) {
            oldChat.name = requestData.name;
          }
          return old;
        },
      );
      queryClient.setQueryData<Chat | undefined>(
        ["chats", "messages", requestData.id],
        (old) => {
          if (old) {
            old.name = requestData.name;
          }
          return old;
        },
      );
    },
  });

  const onSubmit = async (value: string) =>
    await updateMutation.mutateAsync({ name: value });

  return <NameInput<Channel> data={data} dataKey="name" onSubmit={onSubmit} />;
}

/**
 * Name input component for user detail.
 */
export function UserNameInput({ data }: { data: User }) {
  const queryClient = useQueryClient();

  const updateRequest = async (requestData: { username: string }) => {
    const response = await axiosApi.patch(data.url, requestData);
    return response.data;
  };

  const updateMutation = useMutation(updateRequest, {
    onSuccess: async (requestData) => {
      // Update chat data in logged-in user's query
      queryClient.setQueryData<User | undefined>(["users", data.id], (old) => {
        if (old) {
          old.username = requestData.username;
        }
        return old;
      });
    },
  });

  const onSubmit = async (value: string) =>
    await updateMutation.mutateAsync({ username: value });

  return <NameInput<User> data={data} dataKey="username" onSubmit={onSubmit} />;
}

const container = css`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const input = css`
  ${editElement};
  text-align: center;
  width: auto;
  max-width: 100%;
`;

const errorText = css`
  color: ${colors.CONTRAST};
`;
