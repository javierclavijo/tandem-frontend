import { ErrorMessage } from "@hookform/error-message";
import { Helmet } from "react-helmet-async";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import Select from "react-select";
import { animated } from "react-spring";
import { SimpleLayout } from "../../common/components/Layout";
import Nav from "../../common/components/Nav/Nav";
import { select } from "../../common/components/styles";
import { languageOptionsArray } from "../../common/constants";
import useAuth from "../../common/context/AuthContext/AuthContext";
import { useSetFormErrorOnRequestError } from "../../common/hooks";
import { useFadeIn } from "../../common/transitions";
import { useRegisterForm } from "./forms";
import { useRegisterMutation } from "./queries";
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
import { RegisterFormValues } from "./types";

/**
 * Register form component.
 */
function RegisterPage() {
  const { login } = useAuth();
  const transitionProps = useFadeIn();

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    control,
    watch,
  } = useRegisterForm();

  const onMutationError = useSetFormErrorOnRequestError(setError);

  const { mutateAsync } = useRegisterMutation({
    onError: onMutationError,
  });

  /**
   * Form submit handler. Attempts user registration and logs in the user if
   * successful.
   */
  const onSubmit = async (data: RegisterFormValues) => {
    const response = await mutateAsync({
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
  };

  return (
    <>
      <Helmet title="Sign In | LangFlow" />
      <AnimatedLayout style={transitionProps}>
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
                  {...register("username", {
                    required: "Username is required.",
                  })}
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
                  {...register("password", {
                    required: "Password is required",
                  })}
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
                      options={languageOptionsArray}
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
      </AnimatedLayout>
    </>
  );
}

const AnimatedLayout = animated(SimpleLayout);

export default RegisterPage;
