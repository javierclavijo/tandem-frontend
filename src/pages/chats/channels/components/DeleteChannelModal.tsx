import { AxiosResponse } from "axios";
import Button from "../../../../common/components/Button";
import Modal, { ModalProps } from "../../../../common/components/Modal/Modal";
import ModalButtonsContainer from "../../../../common/components/Modal/ModalButtonsContainer";
import ModalTitle from "../../../../common/components/Modal/ModalTitle";

interface DeleteChannelModalProps extends ModalProps {
  onDelete: () => Promise<AxiosResponse<void> | undefined>;
}

/**
 * Channel deletion confirmation modal window.
 */
const DeleteChannelModal = ({
  onDelete,
  ...props
}: DeleteChannelModalProps) => (
  <Modal {...props}>
    <ModalTitle>Delete channel?</ModalTitle>
    <ModalButtonsContainer>
      <Button onClick={onDelete}>Delete</Button>
      <Button onClick={props.onRequestClose}>Cancel</Button>
    </ModalButtonsContainer>
  </Modal>
);

export default DeleteChannelModal;
