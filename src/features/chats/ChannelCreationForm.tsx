/** @jsxImportSource @emotion/react */

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import Select from 'react-select';
import { css } from '@emotion/react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { languageOptions, levelOptions } from '../../resources/languages';
import { modalButton, select } from '../../styles/components';
import { colors, textSizes } from '../../styles/variables';
import { axiosApi } from '../auth/AuthContext';
import { errorCss } from '../auth/styles';

interface ChannelCreationRequestData {
  name: string,
  language: string,
  level: string,
}

export interface ServerErrorResponse {
  [key: string]: string[];
}

function ChannelCreationForm({ closeModal }: { closeModal: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register, handleSubmit, control, formState: { errors }, setError,
  } = useForm();

  const request = async (data: ChannelCreationRequestData) => axiosApi.post('channels/', data);

  const mutation = useMutation(request, {
    onSuccess: () => queryClient.invalidateQueries(['chats', 'list']),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await mutation.mutateAsync({
        name: data.name,
        language: data.language.value,
        level: data.level.value,
      });
      if (response.status === 201) {
        // If the channel has been created successfully, close the modal and navigate to its detail page.
        closeModal();
        navigate(`/chats/channels/${response.data.id}`);
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        // If the server returned any errors, set them in the form. The server returns errors as string arrays,
        // so we must first iterate over the response's entries, and then over the entries' values, setting the
        // error's key as the error's field's name.
        Object.entries(e.response.data as ServerErrorResponse).forEach(([key, value]) => value.forEach((valueError) => setError(key, {
          type: 'focus',
          // Capitalize the message's first letter before setting it as the error message
          message: valueError[0].toUpperCase() + valueError.substring(1),
        }, {
          shouldFocus: true,
        })));
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
    >
      <input
        {...register('name', { required: 'Name is required', maxLength: 64 })}
        required
        placeholder="Channel name"
        css={css`
              font-size: ${textSizes.M};
              border-radius: 3px;
              border: 1px solid ${colors.DARK}50;
              padding: 0.50rem;
              outline: none;
              color: ${colors.DARK};
            `}
      />
      <ErrorMessage
        errors={errors}
        name="name"
        render={({ message }) => <p css={errorCss}>{message}</p>}
      />
      <fieldset css={css`
              border: none;
              padding: 0;
              display: flex;
              gap: 1rem;
            `}
      >
        <div css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                `}
        >
          <Controller
            control={control}
            name="language"
            rules={{ required: 'Language is required' }}
            render={({ field }) => (
              <Select
                id="new-channel-language"
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
            render={({ message }) => <p css={errorCss}>{message}</p>}
          />
        </div>
        <div css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                `}
        >
          <Controller
            control={control}
            name="level"
            rules={{ required: 'Proficiency level is required' }}
            render={({ field }) => (
              <Select
                id="new-channel-level"
                {...field}
                options={levelOptions}
                placeholder="Level"
                styles={select}
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="level"
            render={({ message }) => <p css={errorCss}>{message}</p>}
          />
        </div>
      </fieldset>
      <div css={css`
              display: flex;
              gap: 1rem;
              justify-content: space-between;
            `}
      >
        <button type="submit" css={modalButton}>
          Create channel
        </button>
        <button
          type="button"
          onClick={closeModal}
          css={css`${modalButton};
                          background-color: ${colors.DARK}60;
                        `}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ChannelCreationForm;
