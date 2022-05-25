/** @jsxImportSource @emotion/react */

import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../styles/components";
import SetPasswordForm from "./SetPasswordForm";

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

interface NewLanguageModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SetPasswordModal({ isOpen, setIsOpen }: NewLanguageModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Set password"
      style={modal.container}
    >
      <p css={modal.title}>Change your password</p>
      <SetPasswordForm closeModal={() => setIsOpen(false)} />
    </ReactModal>
  );
}

export default SetPasswordModal;
