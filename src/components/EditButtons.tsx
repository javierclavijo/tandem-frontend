/** @jsxImportSource @emotion/react */

import React from "react";
import Button from "./Button";
import { css } from "@emotion/react";
import { Cancel, Check } from "iconoir-react";

interface EditButtonsProps {
  editEnabled: boolean;
  submitButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
  handleSubmit: () => Promise<boolean>;
  handleCancel: () => void;
  color: string;
}

/**
 * Renders a confirm (check) and a cancel (cross) button.
 */
function EditButtons({
  editEnabled,
  submitButtonRef,
  handleSubmit,
  handleCancel,
  color,
}: EditButtonsProps) {
  return (
    <div css={container}>
      <Button
        visible={editEnabled}
        onClick={handleSubmit}
        ref={submitButtonRef}
      >
        <Check color={color} width={"1.5rem"} height={"1.5rem"} />
      </Button>
      <Button visible={editEnabled} onClick={handleCancel}>
        <Cancel color={color} width={"1.5rem"} height={"1.5rem"} />
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
