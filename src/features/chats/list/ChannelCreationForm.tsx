/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { languageOptions, levelOptions } from "../../../resources/languages";
import { modal, select } from "../../../styles/components";
import { colors, textSizes } from "../../../styles/variables";
import { axiosApi } from "../../auth/AuthContext";
import { errorStyle } from "../../auth/styles";
import { Language, Option, ProficiencyLevel } from "../../common/types";

interface ChannelCreationRequestData {
  name: string;
  language: string;
  level: ProficiencyLevel;
}

export interface ServerErrorResponse {
  [key: string]: string[];
}

interface ChannelCreationFormValues {
  name: string;
  language: Option<Language> | null;
  level: Option<ProficiencyLevel> | null;
}

/**
 * Form which allows the user to create a new channel, used in NewChannelModal.
 */
function ChannelCreationForm({ closeModal }: { closeModal: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // TODO: add form types
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<ChannelCreationFormValues>();

  const request = async (data: ChannelCreationRequestData) =>
    await axiosApi.post("channels/", data);

  const mutation = useMutation(request, {
    onSuccess: () => queryClient.invalidateQueries(["chats", "list", "all"]),
  });

  const onSubmit = async (data: ChannelCreationFormValues) => {
    try {
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
        closeModal();
        navigate(`/chats/channels/${response.data.id}`);
      }
    } catch (e) {
      // TODO: add generic error handling with middlewares.
      if (axios.isAxiosError(e) && e.response) {
        // If the server returned any errors, set them in the form. The server
        // returns errors as string arrays, so we must first iterate over the
        // response's entries, and then over the entries' values, setting the
        // error's key as the error's field's name.
        Object.entries(e.response.data as ServerErrorResponse).forEach(
          ([key, value]) =>
            value.forEach((valueError) =>
              setError(
                key as keyof ChannelCreationFormValues,
                {
                  type: "focus",
                  // Capitalize the message's first letter before setting it as
                  // the error message
                  message:
                    valueError[0].toUpperCase() + valueError.substring(1),
                },
                {
                  shouldFocus: true,
                },
              ),
            ),
        );
      }
    }
  };

  return (
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
                options={languageOptions}
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
                options={levelOptions}
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

const nameInput = css`
  font-size: ${textSizes.M};
  border-radius: 3px;
  border: 1px solid ${colors.DARK}50;
  padding: 0.5rem;
  outline: none;
  color: ${colors.DARK};
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

export default ChannelCreationForm;
