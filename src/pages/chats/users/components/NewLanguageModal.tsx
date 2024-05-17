import Modal, {
  CloseableModalProps,
} from "../../../../common/components/Modal/Modal";
import ModalTitle from "../../../../common/components/Modal/ModalTitle";
import UserInfoNewLanguageSelect from "./UserInfoNewLanguageSelect";

interface NewLanguageModalProps extends CloseableModalProps {}

/**
 * Modal window which allows the user to add a new language to their profile.
 */
function NewLanguageModal({ ...props }: NewLanguageModalProps) {
  return (
    <Modal {...props}>
      <ModalTitle>Add a new language</ModalTitle>
      <UserInfoNewLanguageSelect onClose={props.onRequestClose} />
    </Modal>
  );
}

export default NewLanguageModal;
