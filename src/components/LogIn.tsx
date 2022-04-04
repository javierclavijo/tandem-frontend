import React from "react";
import {useForm} from "react-hook-form";
import {LogInRequestData} from "../app/services/authApi";
import useAuth from "../app/AuthContext";

function LogIn() {

    const {login, error} = useAuth();

    // React Hook Form hooks
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
