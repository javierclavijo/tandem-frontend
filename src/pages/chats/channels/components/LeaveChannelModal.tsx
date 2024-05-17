import Button from "../../../../common/components/Button";
import Modal, { ModalProps } from "../../../../common/components/Modal/Modal";
import ModalButtonsContainer from "../../../../common/components/Modal/ModalButtonsContainer";
import ModalTitle from "../../../../common/components/Modal/ModalTitle";

interface LeaveChannelModalProps extends ModalProps {
  onLeave: () => Promise<void>;
}

/**
 * Confirmation modal window for channel leave action.
 */
function LeaveChannelModal({ onLeave, ...props }: LeaveChannelModalProps) {
  return (
    <Modal {...props}>
      <ModalTitle>Leave channel?</ModalTitle>
      <ModalButtonsContainer>
        <Button onClick={onLeave}>Leave</Button>
        <Button onClick={props.onRequestClose}>Cancel</Button>
      </ModalButtonsContainer>
    </Modal>
  );
}

export default LeaveChannelModal;
