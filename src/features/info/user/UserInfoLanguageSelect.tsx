/** @jsxImportSource @emotion/react */

import React from "react";
import InfoSelect, {languageOptions, levelOptions, Option} from "../components/InfoSelect";
import {UserLanguage} from "../../../entities/User";
import {StylesConfig} from "react-select";
import {colors} from "../../../styles/variables";
import {axiosApi} from "../../auth/AuthContext";
import {useMutation} from "react-query";
import {css} from "@emotion/react";

interface UserInfoLanguageSelectProps {
    data: UserLanguage;
}

function UserInfoLanguageSelect({data}: UserInfoLanguageSelectProps) {

    const updateRequest = React.useCallback(async (requestData: { language: string }) => {
        if (data) {
            const response = await axiosApi.patch(data.url, requestData);
            return response.data;
        }
    }, [data]);

    const mutation = useMutation(updateRequest, {
        onSuccess: async (data) => {
        }
    });

    const handleChange = async (option: Option, key: keyof UserLanguage) => {
        const requestData = {} as any;
        requestData[key] = option.value;
        await mutation.mutateAsync(requestData);
    };


    return (
        <section css={css`
          display: flex;
        `}>
            <InfoSelect id={`language-${data.id}`}
                        initialValue={data.language}
                        options={languageOptions}
                        handleSubmit={(option) => handleChange(option, "language")}
            />
            <InfoSelect id={`level-${data.id}`}
                        initialValue={data.level}
                        options={levelOptions}
                        handleSubmit={(option) => handleChange(option, "level")}
            />
        </section>
    );
}

export default UserInfoLanguageSelect;
