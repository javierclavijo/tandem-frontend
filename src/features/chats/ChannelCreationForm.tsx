/** @jsxImportSource @emotion/react */

import React from "react";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";
import {languageOptions, levelOptions} from "../../resources/languages";
import {select} from "../../styles/components";
import {css} from "@emotion/react";
import {colors, textSizes} from "../../styles/variables";
import {axiosApi} from "../auth/AuthContext";
import {useMutation, useQueryClient} from "react-query";
import {errorCss} from "../auth/styles";


interface ChannelCreationRequestData {
    name: string,
    language: string,
    level: string,
}

function ChannelCreationForm({closeModal}: { closeModal: () => void }) {

    const queryClient = useQueryClient();
    const {register, handleSubmit, control, formState: {errors}} = useForm();

    const request = async (data: ChannelCreationRequestData) => {
        const response = await axiosApi.post("/channels/", data);
        return response.data;
    };

    const mutation = useMutation(request, {
        onSuccess: () => queryClient.invalidateQueries(["chats", "list"])
    });

    const onSubmit = async (data: any) => {
        const response = await mutation.mutateAsync({
            name: data.name,
            language: data.language.value,
            level: data.level.value
        });
        if (response.success) {
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}>
            <input {...register("name", {required: true, maxLength: 64})} placeholder="Channel name" css={css`
              font-size: ${textSizes.M};
              border-radius: 3px;
              border: 1px solid ${colors.DARK}50;
              padding: 0.50rem;
              outline: none;
              color: ${colors.DARK};
            `}/>
            {errors.name?.type === "required" ?
                <p css={errorCss}>Channel name is required.</p> : null}
            <fieldset css={css`
              border: none;
              padding: 0;
              display: flex;
              gap: 1rem;
            `}>
                <div css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                `}>
                    <Controller
                        control={control}
                        name="language"
                        rules={{required: true}}
                        render={({field}) =>
                            <Select id={`new-channel-language`}
                                    {...field}
                                    options={languageOptions}
                                    placeholder="Language"
                                    styles={select}
                            />}
                    />
                    {errors.language?.type === "required" ?
                        <p css={errorCss}>Language is required.</p> : null}
                </div>
                <div css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                `}>
                    <Controller
                        control={control}
                        name="level"
                        rules={{required: true}}
                        render={({field}) =>
                            <Select id={`new-channel-level`}
                                    {...field}
                                    options={levelOptions}
                                    placeholder="Level"
                                    styles={select}
                            />}
                    />
                    {errors.level?.type === "required" ?
                        <p css={errorCss}>Proficiency level is required.</p> : null}
                </div>
            </fieldset>
            <button type="submit" css={css`
              width: fit-content;
              padding: 0.5rem;
              border-radius: 3px;
              border: none;
              background-color: ${colors.PRIMARY};
              color: ${colors.WHITE};
              font-size: ${textSizes.M};
            `}>
                Create channel
            </button>
        </form>
    );
}

export default ChannelCreationForm;