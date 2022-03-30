import React from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate} from "react-router-dom";

type LogInFormData = {
    username: string,
    password: string
}

function LogIn({setToken}: { setToken: Function }) {
    const {register, formState: {errors}, setError, handleSubmit} = useForm<LogInFormData>();
    const navigate = useNavigate();

    const onSubmit = async (data: LogInFormData) => {
        const url = `${process.env.REACT_APP_API_URL as string}/api-token-auth/`;
        try {
            const response = await axios.post(url, {
                username: data.username,
                password: data.password
            });

            // If login is successful, save token in local storage
            const token = response.data.token;
            localStorage.setItem("auth-token", token);
            setToken(token);
            navigate("/chats");

        } catch (exception) {
            // If login couldn't be performed, display error message
            setError("password", {
                type: "server",
                message: "Incorrect username or password."
            });
        }
    };

    return (
        <div>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("username",
                    {required: "Username is required."})}/>
                {errors.username && errors.username.message}

                <input type="password" {...register("password",
                    {required: "Password is required"})}/>
                {errors.password && errors.password.message}

                <button type={"submit"}>Log in</button>
            </form>
        </div>
    );
}

export default LogIn;
