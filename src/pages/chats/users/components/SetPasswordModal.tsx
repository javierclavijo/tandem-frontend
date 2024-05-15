import React from "react";
import ReactModal from "react-modal";
import { setModalAppElement } from "../../../../common/modals";
import { modal } from "../../../../components/styles";
import SetPasswordForm from "./SetPasswordForm";

setModalAppElement();

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
