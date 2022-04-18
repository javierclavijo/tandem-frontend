/** @jsxImportSource @emotion/react */

import React from "react";
import {useForm} from "react-hook-form";
import useAuth, {LogInRequestData} from "./AuthContext";
import {useNavigate} from "react-router-dom";
import {buttonCss, errorCss, formCss, h2Css, inputCss, labelCss, mainCss, sectionCss} from "./styles";
import Nav from "../../components/Nav/Nav";
import {baseAppContainerWithoutTabsCss} from "../../styles/layout";

function LogIn() {

    const {isLoggedIn, login, error} = useAuth();
    const navigate = useNavigate();

    // React Hook Form
    const {
        register,
        formState: {errors},
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
                message: error
            });
        } else {
            clearErrors();
        }
    }, [error, setError, clearErrors]);

    React.useEffect(() => {
        if (isLoggedIn) {
            navigate("/chats");
        }
    }, [isLoggedIn, navigate]);


    return (
        <div css={baseAppContainerWithoutTabsCss}>
            <Nav/>
            <main css={mainCss}>
                <section css={sectionCss}>
                    <h2 css={h2Css}>Log in</h2>
                    <form css={formCss} onSubmit={handleSubmit(onSubmit)}>
                        <label css={labelCss}
                               htmlFor="username">
                            Username
                            <input type="text" id="username"
                                   css={inputCss}
                                   {...register("username", {required: "Username is required."})}/>
                        </label>

                        {errors.username &&
                            <p css={errorCss}>
                                {errors.username.message}
                            </p>
                        }

                        <label css={labelCss}
                               htmlFor="password">
                            Password
                            <input type="password" id="password"
                                   css={inputCss}
                                   {...register("password", {required: "Password is required"})}/>
                        </label>

                        {errors.password &&
                            <p css={errorCss}>
                                {errors.password.message}
                            </p>
                        }

                        <button type="submit"
                                css={buttonCss}>Log in
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default LogIn;
