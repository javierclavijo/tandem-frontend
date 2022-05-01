import React from "react";
import {useForm} from "react-hook-form";


function ChannelCreationForm() {

    const {register, handleSubmit} = useForm();
    const onSubmit = (data: any) => console.log(data);


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name", {required: true, maxLength: 64})}/>
        </form>
    );
}

export default ChannelCreationForm;