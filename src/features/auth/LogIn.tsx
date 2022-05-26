/** @jsxImportSource @emotion/react */

import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { animated } from "react-spring";
import Nav from "../../components/Nav";
import { baseAppContainerWithoutTabs } from "../../styles/layout";
import { useFadeIn } from "../../utils/transitions";
import useAuth, { LogInRequestData } from "./AuthContext";
import { button, errorStyle, form, header, input, label, link, main, section } from "./styles";

function LogIn() {
  const { isLoggedIn, login, error } = useAuth();
  const navigate = useNavigate();
  const transitionProps = useFadeIn();

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
      <animated.main css={main} style={transitionProps}>
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
              render={({ message }) => <p css={errorStyle}>{message}</p>}
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
              render={({ message }) => <p css={errorStyle}>{message}</p>}
            />

            <button type="submit" css={button}>
              Log in
            </button>
            <Link to={"/register"} css={link}>
              Sign in
            </Link>
          </form>
        </section>
      </animated.main>
    </div>
  );
}

export default LogIn;
