/** @jsxImportSource @emotion/react */

import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../styles/components";
import UserInfoNewLanguageSelect from "./UserInfoNewLanguageSelect";

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

interface NewLanguageModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewLanguageModal({ isOpen, setIsOpen }: NewLanguageModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Add a new language"
      style={modal.container}
    >
      <p css={modal.title}>Add a new language</p>
      <UserInfoNewLanguageSelect onClose={() => setIsOpen(false)} />
    </ReactModal>
  );
}

export default NewLanguageModal;
