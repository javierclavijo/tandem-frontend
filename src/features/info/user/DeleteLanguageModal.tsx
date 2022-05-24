/** @jsxImportSource @emotion/react */

import React from "react";
import ReactModal from "react-modal";
import Button from "../../../components/Button";
import { UserLanguage } from "../../../entities/User";
import { languages } from "../../../resources/languages";
import { modal } from "../../../styles/components";

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

interface DeleteLanguageModalProps {
  selectedDeleteLanguage: UserLanguage | null;
  setSelectedDeleteLanguage: React.Dispatch<
    React.SetStateAction<UserLanguage | null>
  >;
  handleDeleteLanguage: () => Promise<void>;
}

function DeleteLanguageModal({
  selectedDeleteLanguage,
  setSelectedDeleteLanguage,
  handleDeleteLanguage,
}: DeleteLanguageModalProps) {
  return (
    <ReactModal
      isOpen={!!selectedDeleteLanguage}
      onRequestClose={() => setSelectedDeleteLanguage(null)}
      contentLabel="Delete language"
      style={modal.container}
    >
      <p css={modal.title}>
        {`Delete ${
          languages.find((l) => l.key === selectedDeleteLanguage?.language)
            ?.value
        } from your languages?`}
      </p>
      <div css={modal.buttonsContainer}>
        <button onClick={handleDeleteLanguage} css={modal.button}>
          Delete
        </button>
        <button
          onClick={() => setSelectedDeleteLanguage(null)}
          css={modal.cancelButton}
        >
          Cancel
        </button>
      </div>
    </ReactModal>
  );
}

export default DeleteLanguageModal;
