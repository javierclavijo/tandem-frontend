import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../components/styles";
import SetPasswordForm from "./SetPasswordForm";

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

interface NewLanguageModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Modal window component which contains the password update form.
 */
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
