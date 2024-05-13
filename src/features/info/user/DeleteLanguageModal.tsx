/** @jsxImportSource @emotion/react */

import React from "react";
import ReactModal from "react-modal";
import { LANGUAGE_INFO } from "../../../resources/languages";
import { modal } from "../../../styles/components";
import { UserLanguage } from "../types";

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

interface DeleteLanguageModalProps {
  selectedDeleteLanguage: UserLanguage | null;
  // TODO: refactor this kind of prop dependencies (setState setters). Look in all files.
  setSelectedDeleteLanguage: React.Dispatch<
    React.SetStateAction<UserLanguage | null>
  >;
  handleDeleteLanguage: () => Promise<void>;
}

/**
 * Modal window which handles deletion of one of the user's language objects.
 */
function DeleteLanguageModal({
  selectedDeleteLanguage,
  setSelectedDeleteLanguage,
  handleDeleteLanguage,
}: DeleteLanguageModalProps) {
  const languageName =
    selectedDeleteLanguage != null
      ? LANGUAGE_INFO[selectedDeleteLanguage?.language].displayName
      : "";

  return (
    <ReactModal
      isOpen={!!selectedDeleteLanguage}
      onRequestClose={() => setSelectedDeleteLanguage(null)}
      contentLabel="Delete language"
      style={modal.container}
    >
      <p css={modal.title}>{`Delete ${languageName} from your languages?`}</p>
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
