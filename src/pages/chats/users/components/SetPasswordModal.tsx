import { css } from "@emotion/react";
import { ErrorMessage } from "@hookform/error-message";
import { AxiosError, isAxiosError } from "axios";
import Button from "../../../../common/components/Button";
import Modal, {
  CloseableModalProps,
} from "../../../../common/components/Modal/Modal";
import ModalButtonsContainer from "../../../../common/components/Modal/ModalButtonsContainer";
import ModalTitle from "../../../../common/components/Modal/ModalTitle";
import useAuth from "../../../../common/context/AuthContext/AuthContext";
import { ServerErrorResponse } from "../../../../common/types";
import { errorStyle, input, label } from "../../../auth/styles";
import { useSetPasswordForm } from "../forms";
import { useSetPasswordMutation } from "../queries";
import { SetPasswordFormValues } from "../types";

interface NewLanguageModalProps extends CloseableModalProps {}

/**
 * Modal window component which allows the user to change their password.
 */
const SetPasswordModal = ({ ...props }: NewLanguageModalProps) => {
  const { user, login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useSetPasswordForm();

  const onMutationError = (e: AxiosError<ServerErrorResponse>) => {
    if (isAxiosError(e) && e.response) {
      // If the server returned any errors, set them in the form. The server
      // returns errors as string arrays, so we must first iterate over the
      // response's entries, and then over the entries' values, setting the
      // error's key as the error's field's name.
      if (e.response.status === 401) {
        setError("oldPassword", {
          type: "server",
          message: "Unable to authenticate with provided password.",
        });
      }
    }
  };

  const mutation = useSetPasswordMutation({ onError: onMutationError });

  const onSubmit = async (data: SetPasswordFormValues) => {
    const response = await mutation.mutateAsync({
      newPassword: data.newPassword,
      oldPassword: data.oldPassword,
    });

    if (response.status === 200 && user != null) {
      props.onRequestClose();
      login({ username: user.username, password: data.newPassword });
    }
  };

  return (
    <Modal {...props}>
      <ModalTitle>Change your password</ModalTitle>
      <form onSubmit={handleSubmit(onSubmit)} css={form}>
        <label css={label} htmlFor="old-password">
          Current password
          <input
            type="password"
            id="old-password"
            css={input}
            {...register("oldPassword", {
              required: "Current password is required",
            })}
          />
        </label>
        <ErrorMessage
          errors={errors}
          name="oldPassword"
          render={({ message }) => <p css={errorStyle}>{message}</p>}
        />

        <label css={label} htmlFor="new-password">
          New password
          <input
            type="password"
            id="new-password"
            css={input}
            {...register("newPassword", {
              required: "New password is required",
            })}
          />
        </label>
        <ErrorMessage
          errors={errors}
          name="newPassword"
          render={({ message }) => <p css={errorStyle}>{message}</p>}
        />

        <label css={label} htmlFor="confirm-new-password">
          Confirm password
          <input
            type="password"
            id="confirm-new-password"
            css={input}
            {...register("confirmNewPassword", {
              required: "Password confirmation is required",
              // Validate that both password fields match.
              // Code initially sourced from https://stackoverflow.com/a/71429960
              validate: (value: string) => {
                if (watch("newPassword") !== value) {
                  return "Passwords don't match.";
                }
              },
            })}
          />
        </label>
        <ModalButtonsContainer>
          <Button type="submit">Set password</Button>
          <Button type="button" onClick={props.onRequestClose}>
            Cancel
          </Button>
        </ModalButtonsContainer>
      </form>
    </Modal>
  );
};

const form = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default SetPasswordModal;
