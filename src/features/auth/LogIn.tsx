/** @jsxImportSource @emotion/react */

import React from "react";
import {useForm} from "react-hook-form";
import useAuth, {LogInRequestData} from "./AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {buttonCss, errorCss, form, header, input, label, link, main, section,} from "./styles";
import Nav from "../../components/Nav";
import {baseAppContainerWithoutTabs} from "../../styles/layout";
import {ErrorMessage} from "@hookform/error-message";

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
      setError("password", {
        type: "server",
        message: error,
      });
    } else {
      clearErrors();
    }
  }, [error, setError, clearErrors]);

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div css={baseAppContainerWithoutTabs}>
      <Nav />
      <main css={main}>
        <section css={section}>
          <h2 css={header}>Log in</h2>
          <form css={form} onSubmit={handleSubmit(onSubmit)}>
            <label css={label} htmlFor="username">
              Username
              <input
                type="text"
                id="username"
                css={input}
                {...register("username", { required: "Username is required." })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => <p css={errorCss}>{message}</p>}
            />

            <label css={label} htmlFor="password">
              Password
              <input
                type="password"
                id="password"
                css={input}
                {...register("password", { required: "Password is required" })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => <p css={errorCss}>{message}</p>}
            />

            <button type="submit" css={buttonCss}>
              Log in
            </button>
            <Link to={"/register"} css={link}>
              Sign in
            </Link>
          </form>
        </section>
      </main>
    </div>
  );
}

export default LogIn;
