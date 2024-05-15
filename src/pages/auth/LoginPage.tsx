import { ErrorMessage } from "@hookform/error-message";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import { baseAppContainerWithoutTabs } from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import Nav from "../../components/Nav/Nav";
import useAuth from "./AuthContext/AuthContext";
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
function LoginPage() {
  const { login } = useAuth();
  const transitionProps = useFadeIn();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useLogInForm();

  return (
    <div css={baseAppContainerWithoutTabs}>
      <Nav />
      <animated.main css={main} style={transitionProps}>
        <section css={section}>
          <h2 css={header}>Log in</h2>
          <form css={form} onSubmit={handleSubmit(login)}>
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
            <Link to={"/auth/register"} css={link}>
              Sign in
            </Link>
          </form>
        </section>
      </animated.main>
    </div>
  );
}

export default LoginPage;
