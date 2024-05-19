import Button from "../../../../common/components/Button";
import Modal, { ModalProps } from "../../../../common/components/Modal/Modal";
import ModalButtonsContainer from "../../../../common/components/Modal/ModalButtonsContainer";
import ModalTitle from "../../../../common/components/Modal/ModalTitle";

interface DeleteLanguageModalProps extends ModalProps {
  languageName: string | null;
  onDelete: () => Promise<void>;
}

/**
 * Modal window which handles deletion of one of the user's language objects.
 */
const DeleteLanguageModal = ({
  languageName,
  onDelete,
  ...props
}: DeleteLanguageModalProps) => (
  <Modal {...props}>
    <ModalTitle>{`Delete ${languageName} from your languages?`}</ModalTitle>
    <ModalButtonsContainer>
      <Button onClick={onDelete}>Delete</Button>
      <Button onClick={props.onRequestClose}>Cancel</Button>
    </ModalButtonsContainer>
  </Modal>
);

export default DeleteLanguageModal;
