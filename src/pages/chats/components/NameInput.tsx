import { css } from "@emotion/react";
import React, { useRef } from "react";
import EditButtons from "../../../common/components/EditButtons";
import { COLORS } from "../../../common/constants";
import { Channel, User } from "../../../common/types";
import { useEditField } from "../hooks";
import {
  useUpdateChannelNameMutation,
  useUpdateUsernameMutation,
} from "../queries";
import { editElement } from "../styles";

interface NameInputProps<TData> {
  data: TData;
  dataKey: keyof TData;
  onSubmit: (value: string) => Promise<void>;
}

/**
 * Base name input component for detail views.
 */
const NameInput = <TData,>({
  data,
  dataKey,
  onSubmit,
}: NameInputProps<TData>) => {
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
  const keyboardSubmitRef = useRef<boolean>(false);

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    // If the submit button was clicked, submit the value. Else, cancel the
    // editing.
    if (event.relatedTarget === submitButtonRef?.current) {
      const success = await handleSubmit();
      if (!success) {
        elementRef?.current?.focus();
      }
    } else if (keyboardSubmitRef.current) {
      // If the blur event was dispatched by the keyboard submit handler, just
      //set 'enabled' to false.
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
    // If the Enter key is pressed, submit the form. If the pressed key is the
    // Escape key, cancel the editing and blur the text area.
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
    <>
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
          pattern="\w+"
        />
        {!!editEnabled && (
          <EditButtons
            submitButtonRef={submitButtonRef}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            color={COLORS.WHITE}
          />
        )}
      </div>

      {error ? <p css={errorText}>{error}</p> : null}
    </>
  );
};

/**
 * Name input component for channel detail.
 */
export const ChannelNameInput = ({ data }: { data: Channel }) => {
  const updateMutation = useUpdateChannelNameMutation(data);

  const onSubmit = async (value: string) =>
    await updateMutation.mutateAsync({ name: value });

  return <NameInput<Channel> data={data} dataKey="name" onSubmit={onSubmit} />;
};

/**
 * Name input component for user detail.
 */
export const UserNameInput = ({ data }: { data: User }) => {
  const updateMutation = useUpdateUsernameMutation(data);

  const onSubmit = async (value: string) =>
    await updateMutation.mutateAsync({ username: value });

  return <NameInput<User> data={data} dataKey="username" onSubmit={onSubmit} />;
};

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
  color: ${COLORS.CONTRAST};
`;
