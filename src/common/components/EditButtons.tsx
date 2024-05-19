import { css } from "@emotion/react";
import { Check, Xmark } from "iconoir-react";
import React from "react";
import EditButton from "./EditButton";

interface EditButtonsProps {
  submitButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
  handleSubmit: () => Promise<boolean>;
  handleCancel: () => void;
  color: string;
}

/**
 * Renders a confirm (check) and a cancel (cross) button.
 */
const EditButtons = ({
  submitButtonRef,
  handleSubmit,
  handleCancel,
  color,
}: EditButtonsProps) => (
  <div css={container}>
    <EditButton onClick={handleSubmit} ref={submitButtonRef}>
      <Check color={color} width={"1.5rem"} height={"1.5rem"} />
    </EditButton>
    <EditButton onClick={handleCancel}>
      <Xmark color={color} width={"1.5rem"} height={"1.5rem"} />
    </EditButton>
  </div>
);

const container = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default EditButtons;
