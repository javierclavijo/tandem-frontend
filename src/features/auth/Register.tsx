/** @jsxImportSource @emotion/react */

import React from 'react';
import useAuth, {axiosApi, LogInRequestData} from "./AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {baseAppContainerWithoutTabsCss} from "../../styles/layout";
import Nav from "../../components/Nav";
import {buttonCss, errorCss, formCss, h2Css, inputCss, labelCss, mainCss, sectionCss} from "./styles";
import {ErrorMessage} from "@hookform/error-message";
import {useMutation} from "react-query";
import {css} from "@emotion/react";
import {colors} from "../../styles/variables";


interface RegisterRequestData extends LogInRequestData {
    confirmPassword: string;
}


function Register() {

    const {isLoggedIn, login, error} = useAuth();
    const navigate = useNavigate();

    // React Hook Form
    const {
        register,
        formState: {errors},
        setError,
        clearErrors,
        handleSubmit,
    } = useForm<RegisterRequestData>();


    const registerRequest = async (data: LogInRequestData) => {
        return await axiosApi.post('/users', data)
    }

    const {mutateAsync: registerMutateAsync} = useMutation(registerRequest)

    const onSubmit = (data: RegisterRequestData) => {
        if (data.password !== data.confirmPassword) {
            setError("password", {
                type: "server",
                message: error
            });
            return;
        }
        const response = registerMutateAsync({
            username: data.username,
            password: data.password
        })
    }

    React.useEffect(() => {
        if (error) {
            setError("password", {
                type: "server",
                message: "Passwords don't match."
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
                    <h2 css={h2Css}>Sign In</h2>
                    <form css={formCss} onSubmit={handleSubmit(onSubmit)}>
                        <label css={labelCss}
                               htmlFor="username">
                            Username
                            <input type="text" id="username"
                                   css={inputCss}
                                   {...register("username", {required: "Username is required."})}/>
                        </label>
                        <ErrorMessage
                            errors={errors}
                            name="username"
                            render={({message}) => <p css={errorCss}>{message}</p>}
                        />

                        <label css={labelCss}
                               htmlFor="password">
                            Password
                            <input type="password" id="password"
                                   css={inputCss}
                                   {...register("password", {required: "Password is required"})}/>
                        </label>
                        <ErrorMessage
                            errors={errors}
                            name="password"
                            render={({message}) => <p css={errorCss}>{message}</p>}
                        />

                        <label css={labelCss}
                               htmlFor="confirm-password">
                            Confirm password
                            <input type="password" id="confirm-password"
                                   css={inputCss}
                                   {...register("confirmPassword", {required: "Password confirmation is required"})}/>
                        </label>
                        <ErrorMessage
                            errors={errors}
                            name="confirmPassword"
                            render={({message}) => <p css={errorCss}>{message}</p>}
                        />

                        <button type="submit"
                                css={buttonCss}>Sign in
                        </button>
                        <Link to={'/login'} css={css`
                          color: ${colors.PRIMARY};

                          &:visited {
                            color: ${colors.PRIMARY};
                          }
                        `}>
                            Log in
                        </Link>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Register;