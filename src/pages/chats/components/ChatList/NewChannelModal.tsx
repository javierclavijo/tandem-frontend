import { css } from "@emotion/react";
import { ErrorMessage } from "@hookform/error-message";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import Button from "../../../../common/components/Button";
import Modal, {
  CloseableModalProps,
} from "../../../../common/components/Modal/Modal";
import ModalTitle from "../../../../common/components/Modal/ModalTitle";
import { select } from "../../../../common/components/styles";
import {
  COLORS,
  FONT_SIZES,
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
} from "../../../../common/constants";
import { useSetFormErrorOnRequestError } from "../../../../common/hooks";
import { Option } from "../../../../common/types";
import { errorStyle } from "../../../auth/styles";
import { useChannelCreationForm } from "./forms";
import { useCreateChannelMutation } from "./queries";
import { ChannelCreationFormValues } from "./types";

interface NewChannelModalProps extends CloseableModalProps {}

/**
 * Modal for channel creation.
 */
function NewChannelModal({ onRequestClose, ...props }: NewChannelModalProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useChannelCreationForm();

  const onMutationError = useSetFormErrorOnRequestError(setError);
  const mutation = useCreateChannelMutation({ onError: onMutationError });

  const onSubmit = async (data: ChannelCreationFormValues) => {
    if (data.language == null || data.level == null) {
      return;
    }

    const response = await mutation.mutateAsync({
      name: data.name,
      language: data.language.value,
      level: data.level.value,
    });

    if (response.status === 201) {
      // If the channel has been created successfully, close the modal and
      // navigate to its detail page.
      onRequestClose();
      navigate(`/chats/channels/${response.data.id}`);
    }
  };

  return (
    <Modal {...props}>
      <ModalTitle>Create a new channel</ModalTitle>
      <form onSubmit={handleSubmit(onSubmit)} css={form}>
        <input
          {...register("name", { required: "Name is required", maxLength: 64 })}
          required={true}
          placeholder="Channel name"
          css={nameInput}
        />
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => <p css={errorStyle}>{message}</p>}
        />
        <fieldset css={fieldset}>
          <div css={selectContainer}>
            <Controller
              control={control}
              name="language"
              rules={{ required: "Language is required" }}
              render={({ field }) => (
                <Select
                  id={`new-channel-language`}
                  {...field}
                  options={LANGUAGE_OPTIONS}
                  placeholder="Language"
                  styles={select}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="language"
              render={({ message }) => <p css={errorStyle}>{message}</p>}
            />
          </div>
          <div css={selectContainer}>
            <Controller
              control={control}
              name="level"
              rules={{ required: "Proficiency level is required" }}
              render={({ field }) => (
                <Select<Option>
                  id={`new-channel-level`}
                  {...field}
                  options={LEVEL_OPTIONS}
                  placeholder="Level"
                  styles={select as StylesConfig<Option>}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="level"
              render={({ message }) => <p css={errorStyle}>{message}</p>}
            />
          </div>
        </fieldset>
        <div css={buttonsContainer}>
          <Button type="submit">Create channel</Button>
          <Button type="button" onClick={onRequestClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const form = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const nameInput = css`
  font-size: ${FONT_SIZES.M};
  border-radius: 3px;
  border: 1px solid ${COLORS.DARK}50;
  padding: 0.5rem;
  outline: none;
  color: ${COLORS.DARK};
`;

const fieldset = css`
  border: none;
  padding: 0;
  display: flex;
  gap: 1rem;
`;

const selectContainer = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const buttonsContainer = css`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;

export default NewChannelModal;
