/** @jsxImportSource @emotion/react */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useMutation } from 'react-query';
import { css } from '@emotion/react';
import Select from 'react-select';
import axios from 'axios';
import useAuth, { axiosApi, LogInRequestData } from './AuthContext';
import { baseAppContainerWithoutTabsCss } from '../../styles/layout';
import Nav from '../../components/Nav';
import {
  buttonCss, errorCss, formCss, h2Css, inputCss, labelCss, mainCss, sectionCss,
} from './styles';
import { colors } from '../../styles/variables';
import { languageOptions, Option } from '../../resources/languages';
import { select } from '../../styles/components';
import { ServerErrorResponse } from '../chats/ChannelCreationForm';

interface RegisterRequestData extends LogInRequestData {
  email: string;
  nativeLanguages: string[];
}

interface RegisterFormData extends LogInRequestData {
  email: string;
  nativeLanguages: Option[];
  confirmPassword: string;
}

function Register() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    control,
    watch,
  } = useForm<RegisterFormData>();

  const registerRequest = async (data: RegisterRequestData) => axiosApi.post('users/', data);

  const { mutateAsync: registerMutateAsync } = useMutation(registerRequest);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerMutateAsync({
        username: data.username,
        password: data.password,
        email: data.email,
        nativeLanguages: data.nativeLanguages.map((language) => language.value),
      });
      if (response.status === 201) {
        await login({
          username: data.username,
          password: data.password,
        });
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        Object.entries(e.response.data as ServerErrorResponse).forEach(([key, value]) => value.forEach((valueError) => setError(key as keyof RegisterFormData, {
          type: 'focus',
          // Capitalize the message's first letter before setting it as the error message
          message: valueError[0].toUpperCase() + valueError.substring(1),
        }, {
          shouldFocus: true,
        })));
      }
    }
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/chats');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div css={baseAppContainerWithoutTabsCss}>
      <Nav />
      <main css={mainCss}>
        <section css={sectionCss}>
          <h2 css={h2Css}>Sign In</h2>
          <form css={formCss} onSubmit={handleSubmit(onSubmit)}>
            <label
              css={labelCss}
              htmlFor="username"
            >
              Username
              <input
                type="text"
                id="username"
                css={inputCss}
                {...register('username', { required: 'Username is required.' })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => <p css={errorCss}>{message}</p>}
            />

            <label
              css={labelCss}
              htmlFor="email"
            >
              Email
              <input
                type="email"
                id="email"
                css={inputCss}
                {...register('email', { required: 'Email is required.' })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => <p css={errorCss}>{message}</p>}
            />

            <label
              css={labelCss}
              htmlFor="password"
            >
              Password
              <input
                type="password"
                id="password"
                css={inputCss}
                {...register('password', { required: 'Password is required' })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => <p css={errorCss}>{message}</p>}
            />

            <label
              css={labelCss}
              htmlFor="confirm-password"
            >
              Confirm password
              <input
                type="password"
                id="confirm-password"
                css={inputCss}
                {...register('confirmPassword', {
                  required: 'Password confirmation is required',
                  // Validate that both password fields match.
                  // Code initially sourced from https://stackoverflow.com/a/71429960
                  validate: (value: string) => {
                    if (watch('password') !== value) {
                      return "Passwords don't match.";
                    }
                  },
                })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              render={({ message }) => <p css={errorCss}>{message}</p>}
            />

            <label
              css={labelCss}
              htmlFor="native-languages"
            >
              Native languages
              <Controller
                control={control}
                name="nativeLanguages"
                rules={{ required: 'One or more native languages must be selected.' }}
                render={({ field }) => (
                  <Select
                    id="native-languages" isMulti
                    {...field}
                    value={field.value}
                    options={languageOptions}
                    placeholder="Native languages"
                    styles={select}
                  />
                )}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="nativeLanguages"
              render={({ message }) => <p css={errorCss}>{message}</p>}
            />

            <button
              type="submit"
              css={buttonCss}
            >
              Sign in
            </button>
            <Link
              to="/login"
              css={css`
                          color: ${colors.PRIMARY};

                          &:visited {
                            color: ${colors.PRIMARY};
                          }
                        `}
            >
              Log in
            </Link>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Register;
