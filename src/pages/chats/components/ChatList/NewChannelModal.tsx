import React from "react";
import ReactModal from "react-modal";
import { modal } from "../../../../common/components/styles";
import { setModalAppElement } from "../../../../common/modals";
import ChannelCreationForm from "./ChannelCreationForm";

setModalAppElement();

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
