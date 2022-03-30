import React from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {LoginRequest, useLoginMutation} from "../app/services/api";
import {useAppDispatch} from "../app/hooks";
import {setCredentials} from "../app/authSlice";

function LogIn() {
    const {register, formState: {errors}, setError, handleSubmit} = useForm<LoginRequest>();
    const [login] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginRequest) => {
        try {
            const response = await login(data).unwrap();
            dispatch(setCredentials(response));
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
