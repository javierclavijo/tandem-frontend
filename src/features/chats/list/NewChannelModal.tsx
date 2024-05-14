import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../styles/components";
import ChannelCreationForm from "./ChannelCreationForm";

// Set the modal's app element to "hide the application from assistive screenreaders and other assistive technologies
// while the modal is open" (see react-modal docs: https://reactcommunity.org/react-modal/examples/set_app_element/).
ReactModal.setAppElement("#root");

interface NewChannelModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Modal for channel creation.
 */
function NewChannelModal({ isOpen, setIsOpen }: NewChannelModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Add a new language"
      style={modal.container}
    >
      <h3 css={modal.title}>Create a new channel</h3>
      <ChannelCreationForm closeModal={() => setIsOpen(false)} />
    </ReactModal>
  );
}

export default NewChannelModal;
