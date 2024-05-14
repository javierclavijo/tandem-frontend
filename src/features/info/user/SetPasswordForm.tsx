import { css } from "@emotion/react";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { modal } from "../../../styles/components";
import useAuth, { axiosApi } from "../../auth/AuthContext";
import { errorStyle, input, label } from "../../auth/styles";

interface SetPasswordRequestData {
  newPassword: string;
  oldPassword: string;
}

interface SetPasswordFormData extends SetPasswordRequestData {
  confirmNewPassword: string;
}

export interface ServerErrorResponse {
  [key: string]: string[];
}

/**
 * Form which allows the user to change their password.
 */
function SetPasswordForm({ closeModal }: { closeModal: () => void }) {
  const { user, login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SetPasswordFormData>();

  const request = async (data: SetPasswordRequestData) =>
    await axiosApi.patch("set_password/", data);

  const mutation = useMutation(request);

  const onSubmit = async (data: SetPasswordFormData) => {
    try {
      const response = await mutation.mutateAsync({
        newPassword: data.newPassword,
        oldPassword: data.oldPassword,
      });

      if (response.status === 200 && user != null) {
        closeModal();
        login({ username: user.username, password: data.newPassword });
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        // If the server returned any errors, set them in the form. The server returns errors as string arrays,
        // so we must first iterate over the response's entries, and then over the entries' values, setting the
        // error's key as the error's field's name.
        if (e.response.status === 401) {
          setError("oldPassword", {
            type: "server",
            message: "Unable to authenticate with provided password.",
          });
        }
      }
    }
  };

  return (
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
      <div css={modal.buttonsContainer}>
        <button type="submit" css={modal.button}>
          Create channel
        </button>
        <button type="button" onClick={closeModal} css={modal.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

const form = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default SetPasswordForm;
