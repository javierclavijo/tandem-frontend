import React from "react";
import ReactModal from "react-modal";
import { setModalAppElement } from "../../../../common/modals";
import { modal } from "../../../../components/styles";

setModalAppElement();

interface LeaveChannelModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLeave: () => Promise<void>;
}

/**
 * Confirmation modal window for channel leave action.
 */
function LeaveChannelModal({
  isOpen,
  setIsOpen,
  handleLeave,
}: LeaveChannelModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Leave channel"
      style={modal.container}
    >
      <p css={modal.title}>Leave channel?</p>
      <div css={modal.buttonsContainer}>
        <button onClick={handleLeave} css={modal.button}>
          Leave
        </button>
        <button onClick={() => setIsOpen(false)} css={modal.cancelButton}>
          Cancel
        </button>
      </div>
    </ReactModal>
  );
}

export default LeaveChannelModal;
