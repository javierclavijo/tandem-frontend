import { css } from "@emotion/react";
import ReactModal from "react-modal";
import { COLORS, FONT_SIZES } from "../../constants";

export interface ModalProps extends ReactModal.Props {}

/**
 * Modifies Modal props to allow onRequestClose() to be called from code.
 *
 * To do so, it overwrite onRequestClose, as it requires an event by default and
 * we aren't using it in our handlers --this way, we can use it in code as a
 * generic close function.
 */
export interface CloseableModalProps
  extends Omit<ModalProps, "onRequestClose"> {
  onRequestClose: () => void;
}

/**
 * Styled generic modal window.
 */
function Modal({ children, ...props }: ModalProps) {
  return (
    <ReactModal {...props} style={{ ...modal.container, ...props.style }}>
      <p css={modal.title}>Delete channel?</p>
      {children}
    </ReactModal>
  );
}

export const modal = {
  container: {
    content: {
      margin: "auto",
      width: "fit-content",
      height: "fit-content",
      overflow: "visible",
      padding: "1.25rem",
    },
    overlay: {
      zIndex: 100,
    },
  },

  title: css`
    margin-bottom: 1rem;
    color: ${COLORS.DARK};
  `,

  buttonsContainer: css`
    display: flex;
    gap: 1rem;
  `,

  cancelButton: css`
    width: fit-content;
    padding: 0.5rem;
    border-radius: 3px;
    border: none;
    background-color: ${COLORS.PRIMARY};
    color: ${COLORS.WHITE};
    font-size: ${FONT_SIZES.M};
    cursor: pointer;
    background-color: ${COLORS.DARK}80;

    transition: background-color 0.1s;
    &:active,
    &:hover,
    &:focus {
      background-color: ${COLORS.DARK};
    }
  `,
};

/**
 * Set the modal's app element to "hide the application from assistive
 * screenreaders and other assistive technologies while the modal is open".
 * See react-modal docs:
 * https://reactcommunity.org/react-modal/examples/set_app_element/).
 */
ReactModal.setAppElement("#root");

export default Modal;
