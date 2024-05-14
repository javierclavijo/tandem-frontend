import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import Select from "react-select";
import { animated } from "react-spring";
import { axiosApi } from "../../App";
import { languageOptions } from "../../common/resources/languages";
import Nav from "../../components/Nav/Nav";
import { select } from "../../components/styles";
import { ServerErrorResponse } from "../chats/list/ChannelCreationForm";
import { baseAppContainerWithoutTabs } from "../common/styles";
import { useFadeIn } from "../common/transitions";
import { Option } from "../common/types";
import useAuth, { LogInRequestData } from "./AuthContext";
import { useRedirectIfLoggedIn } from "./hooks";
import {
  button,
  errorStyle,
  form,
  header,
  input,
  label,
  link,
  main,
  section,
} from "./styles";

interface RegisterRequestData extends LogInRequestData {
  email: string;
  nativeLanguages: string[];
}

interface RegisterFormData extends LogInRequestData {
  email: string;
  nativeLanguages: Option[];
  confirmPassword: string;
}

/**
 * Register form component.
 */
function Register() {
  const { login } = useAuth();
  const transitionProps = useFadeIn();
  useRedirectIfLoggedIn("/home");

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    control,
    watch,
  } = useForm<RegisterFormData>();

  const registerRequest = async (data: RegisterRequestData) => {
    return await axiosApi.post("users/", data);
  };

  const { mutateAsync: registerMutateAsync } = useMutation(registerRequest);

  /**
   * Form submit handler. Attempts user registration and sets any error messages sent by the server.
   *  If successful, logs in the user.
   */
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
        Object.entries(e.response.data as ServerErrorResponse).forEach(
          ([key, value]) =>
            value.forEach((valueError) =>
              setError(
                key as keyof RegisterFormData,
                {
                  type: "focus",
                  // Capitalize the message's first letter before setting it as the error message
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
    <animated.div css={baseAppContainerWithoutTabs} style={transitionProps}>
      <Nav />
      <main css={main}>
        <section css={section}>
          <h2 css={header}>Sign In</h2>
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

            <label css={label} htmlFor="email">
              Email
              <input
                type="email"
                id="email"
                css={input}
                {...register("email", { required: "Email is required." })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="email"
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

            <label css={label} htmlFor="confirm-password">
              Confirm password
              <input
                type="password"
                id="confirm-password"
                css={input}
                {...register("confirmPassword", {
                  required: "Password confirmation is required",
                  // Validate that both password fields match.
                  // Code initially sourced from https://stackoverflow.com/a/71429960
                  validate: (value: string) => {
                    if (watch("password") !== value) {
                      return "Passwords don't match.";
                    }
                  },
                })}
              />
            </label>
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              render={({ message }) => <p css={errorStyle}>{message}</p>}
            />

            <label css={label} htmlFor="native-languages">
              Native languages
              <Controller
                control={control}
                name="nativeLanguages"
                rules={{
                  required: "One or more native languages must be selected.",
                }}
                render={({ field }) => (
                  <Select
                    id="native-languages"
                    isMulti={true}
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
              render={({ message }) => <p css={errorStyle}>{message}</p>}
            />

            <button type="submit" css={button}>
              Sign in
            </button>
            <Link to={"/auth/login"} css={link}>
              Log in
            </Link>
          </form>
        </section>
      </main>
    </animated.div>
  );
}

export default Register;
