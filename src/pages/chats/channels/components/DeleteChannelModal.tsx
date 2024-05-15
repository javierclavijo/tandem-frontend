import Button from "../../../../common/components/Button";
import Modal, { ModalProps } from "../../../../common/components/Modal/Modal";
import ModalButtonsContainer from "../../../../common/components/Modal/ModalButtonsContainer";
import ModalTitle from "../../../../common/components/Modal/ModalTitle";

interface DeleteChannelModalProps extends ModalProps {
  onDelete: () => Promise<void>;
}

/**
 * Channel deletion confirmation modal window.
 */
function DeleteChannelModal({ onDelete, ...props }: DeleteChannelModalProps) {
  return (
    <Modal {...props}>
      <ModalTitle>Delete channel?</ModalTitle>
      <ModalButtonsContainer>
        <Button onClick={onDelete}>Delete</Button>
        <Button onClick={props.onRequestClose}>Cancel</Button>
      </ModalButtonsContainer>
    </Modal>
  );
}

export default DeleteChannelModal;
