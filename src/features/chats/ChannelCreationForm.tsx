/** @jsxImportSource @emotion/react */

import React from "react";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import {languageOptions, levelOptions} from "../../resources/languages";
import {modalButton, select} from "../../styles/components";
import {css} from "@emotion/react";
import {colors, textSizes} from "../../styles/variables";
import {axiosApi} from "../auth/AuthContext";
import {useMutation, useQueryClient} from "react-query";
import {errorCss} from "../auth/styles";
import {useNavigate} from "react-router-dom";


interface ChannelCreationRequestData {
    name: string,
    language: string,
    level: string,
}

function ChannelCreationForm({closeModal}: { closeModal: () => void }) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {register, handleSubmit, control, formState: {errors}} = useForm();

    const request = async (data: ChannelCreationRequestData) => await axiosApi.post("/channels/", data);

    const mutation = useMutation(request, {
        onSuccess: () => queryClient.invalidateQueries(["chats", "list"])
    });

    const onSubmit = async (data: any) => {
        const response = await mutation.mutateAsync({
            name: data.name,
            language: data.language.value,
            level: data.level.value
        });
        debugger
        if (response.status === 201) {
            // If the channel has been created successfully, close the modal and navigate to its detail page.
            closeModal();
            navigate(`/chats/channels/${response.data.id}`);
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
            <div css={css`
              display: flex;
              gap: 1rem;
              justify-content: space-between;
            `}>
                <button type="submit" css={modalButton}>
                    Create channel
                </button>
                <button type="button" onClick={closeModal}
                        css={css`${modalButton};
                          background-color: ${colors.DARK}60;
                        `}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ChannelCreationForm;