import { css } from "@emotion/react";
import { Check, Xmark } from "iconoir-react";
import React from "react";
import Button from "./Button";

interface EditButtonsProps {
  submitButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
  handleSubmit: () => Promise<boolean>;
  handleCancel: () => void;
  color: string;
}

/**
 * Renders a confirm (check) and a cancel (cross) button.
 */
function EditButtons({
  submitButtonRef,
  handleSubmit,
  handleCancel,
  color,
}: EditButtonsProps) {
  return (
    <div css={container}>
      <Button onClick={handleSubmit} ref={submitButtonRef}>
        <Check color={color} width={"1.5rem"} height={"1.5rem"} />
      </Button>
      <Button onClick={handleCancel}>
        <Xmark color={color} width={"1.5rem"} height={"1.5rem"} />
      </Button>
    </div>
  );
}

const container = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default EditButtons;
