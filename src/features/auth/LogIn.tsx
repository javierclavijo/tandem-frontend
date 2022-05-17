/** @jsxImportSource @emotion/react */

import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { css } from '@emotion/react';
import useAuth, { LogInRequestData } from './AuthContext';
import {
  buttonCss, errorCss, formCss, h2Css, inputCss, labelCss, mainCss, sectionCss,
} from './styles';
import Nav from '../../components/Nav';
import { baseAppContainerWithoutTabsCss } from '../../styles/layout';
import { colors } from '../../styles/variables';

function LogIn() {
  const { isLoggedIn, login, error } = useAuth();
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<LogInRequestData>();

  const onSubmit = async (data: LogInRequestData) => {
    login(data);
  };

  React.useEffect(() => {
    if (error) {
      setError('password', {
        type: 'server',
        message: error,
      });
    } else {
      clearErrors();
    }
  }, [error, setError, clearErrors]);

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
          <h2 css={h2Css}>Log in</h2>
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

            <button
              type="submit"
              css={buttonCss}
            >
              Log in
            </button>
            <Link
              to="/register"
              css={css`
                          color: ${colors.PRIMARY};

                          &:visited {
                            color: ${colors.PRIMARY};
                          }
                        `}
            >
              Sign in
            </Link>
          </form>
        </section>
      </main>
    </div>
  );
}

export default LogIn;
