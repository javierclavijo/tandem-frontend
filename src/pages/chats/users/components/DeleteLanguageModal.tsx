import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../../common/components/styles";
import { setModalAppElement } from "../../../../common/modals";
import { LANGUAGE_INFO } from "../../../../common/resources/languages";
import { UserLanguage } from "../../types";

setModalAppElement();

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
