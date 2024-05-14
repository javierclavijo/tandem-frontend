import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../../components/styles";

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

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
