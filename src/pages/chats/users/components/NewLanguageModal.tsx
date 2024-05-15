import React from "react";
import ReactModal from "react-modal";
import { setModalAppElement } from "../../../../common/modals";
import { modal } from "../../../../components/styles";
import UserInfoNewLanguageSelect from "./UserInfoNewLanguageSelect";

setModalAppElement();

interface NewLanguageModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Modal window which allows the user to add a new language to their profile.
 */
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
