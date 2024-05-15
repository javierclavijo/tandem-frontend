import ReactModal from "react-modal";

/**
 * Sets the modal's app element to "hide the application from assistive
 * screenreaders and other assistive technologies while the modal is open".
 * See react-modal docs:
 * https://reactcommunity.org/react-modal/examples/set_app_element/).
 */
export const setModalAppElement = () => ReactModal.setAppElement("#root");
