import { ErrorMessage } from "@hookform/error-message";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import { SimpleLayout } from "../../common/components/Layout";
import Nav from "../../common/components/Nav/Nav";
import useAuth from "../../common/context/AuthContext/AuthContext";
import { useFadeIn } from "../../common/transitions";
import { useLogInForm } from "./forms";
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

/**
 * Login form component.
 */
const LoginPage = () => {
  const { login } = useAuth();
  const transitionProps = useFadeIn();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useLogInForm();

  return (
    <>
      <Helmet title="Log In | LangFlow" />
      <SimpleLayout>
        <Nav />
        <animated.main css={main} style={transitionProps}>
          <section css={section}>
            <h2 css={header}>Log In</h2>
            <form css={form} onSubmit={handleSubmit(login)}>
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

              <button type="submit" css={button}>
                Log in
              </button>
              <Link to={"/auth/register"} css={link}>
                Sign in
              </Link>
            </form>
          </section>
        </animated.main>
      </SimpleLayout>
    </>
  );
};

export default LoginPage;
