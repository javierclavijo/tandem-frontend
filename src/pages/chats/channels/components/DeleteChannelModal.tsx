import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../../common/components/styles";
import { setModalAppElement } from "../../../../common/modals";

setModalAppElement();

interface DeleteChannelModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}

/**
 * Channel deletion confirmation modal window.
 */
function DeleteChannelModal({
  isOpen,
  setIsOpen,
  handleDelete,
}: DeleteChannelModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Delete channel"
      style={modal.container}
    >
      <p css={modal.title}>Delete channel?</p>
      <div css={modal.buttonsContainer}>
        <button onClick={handleDelete} css={modal.button}>
          Delete
        </button>
        <button onClick={() => setIsOpen(false)} css={modal.cancelButton}>
          Cancel
        </button>
      </div>
    </ReactModal>
  );
}

export default DeleteChannelModal;
