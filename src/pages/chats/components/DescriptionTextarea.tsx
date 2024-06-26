import { css } from "@emotion/react";
import React, { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import EditButtons from "../../../common/components/EditButtons";
import { COLORS } from "../../../common/constants";
import { Channel, User } from "../../../common/types";
import { useEditField } from "../hooks";
import { useUpdateChannelDescriptionMutation } from "../queries";
import { editElement } from "../styles";
import { ChatType } from "../types";

interface DescriptionTextareaProps {
  data: Channel | User;
  queryKey: ChatType;
}

/**
 * Text area component to edit a user or channel's description.
 */
const DescriptionTextarea = ({ data, queryKey }: DescriptionTextareaProps) => {
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
  } = useEditField<HTMLTextAreaElement, Channel | User>(data, "description");

  // Used in handleBlur() to handle the case of submitting through keyboard.
  const keyboardSubmitRef = useRef<boolean>(false);

  const updateMutation = useUpdateChannelDescriptionMutation(data, queryKey);

  const handleBlur = async (event: React.FocusEvent<HTMLTextAreaElement>) => {
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
      setError("Description must have a length between 1 and 2000 characters.");
      return false;
    }
    const requestData = { description: value };
    await updateMutation.mutateAsync(requestData);
    setEditEnabled(false);
    return true;
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    // If the Meta or Control key is pressed at the same time as the Enter key, submit the form. If the pressed key
    // is the Escape key, cancel the editing and blur the text area.
    if ((event.metaKey || event.ctrlKey) && event.code === "Enter") {
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
      <div css={titleContainer}>
        <h3>Description</h3>
        {!!editEnabled && (
          <EditButtons
            submitButtonRef={submitButtonRef}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            color={COLORS.WHITE}
          />
        )}
      </div>
      <TextareaAutosize
        id="description"
        name="description"
        ref={elementRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        minRows={1}
        maxRows={8}
        css={editElement}
        placeholder="Add a description…"
        spellCheck={false}
      />
      {error.length !== 0 && <p css={errorText}>{error}</p>}
    </>
  );
};

const titleContainer = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 1.5rem;
`;

const errorText = css`
  color: ${COLORS.CONTRAST};
`;

export default DescriptionTextarea;
