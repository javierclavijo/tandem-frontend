/** @jsxImportSource @emotion/react */

import React from "react";
import {languageOptions, levelOptions, Option} from "../components/InfoSelect";
import useAuth, {axiosApi} from "../../auth/AuthContext";
import {useMutation} from "react-query";
import {css} from "@emotion/react";
import Select, {StylesConfig} from "react-select";
import {colors} from "../../../styles/variables";
import EditButton from "../components/EditButton";

interface UserInfoNewLanguageSelectRequestData {
    language: string;
    level: string;
    user: string;
}

const styles: StylesConfig = {
    option: (provided, state) => ({
        ...provided,
        color: colors.DARK
    })
};

function UserInfoNewLanguageSelect({onClose}: { onClose: () => void }) {

    const {user} = useAuth();

    const [languageValue, setLanguageValue] = React.useState<Option | null>(null);
    const [levelValue, setLevelValue] = React.useState<Option | null>(null);
    const [error, setError] = React.useState<string>("");

    const updateRequest = async (requestData: UserInfoNewLanguageSelectRequestData) => {
        const response = await axiosApi.post("/user_languages/", requestData);
        return response.data;
    };

    const mutation = useMutation(updateRequest, {
        onSuccess: async (data) => {
        }
    });

    const clearError = () => setError("");

    const handleSubmit = React.useCallback(async () => {
        if (!languageValue || !levelValue) {
            setError("Language and level must be selected.");
            return false;
        } else if (user) {
            const requestData = {"user": user?.url, "language": languageValue.value, "level": levelValue.value};
            await mutation.mutateAsync(requestData);
            onClose();
            return true;
        }
        return false;
    }, [languageValue, levelValue, user]);

    return (
        <div css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        `}>
            <div css={css`
              display: flex;
              gap: 1rem;
            `}>
                <Select id={`language-new`}
                        value={languageValue}
                        onChange={(option: any) => setLanguageValue(option)}
                        onFocus={clearError}
                        options={languageOptions}
                        styles={styles}
                />
                <Select id={`level-new`}
                        value={levelValue}
                        onChange={(option: any) => setLevelValue(option)}
                        onFocus={clearError}
                        options={levelOptions}
                        styles={styles}
                />
                <EditButton type={"accept"} visible={true} onClick={handleSubmit} color={colors.PRIMARY}/>
                <EditButton type={"cancel"} visible={true} onClick={onClose} color={colors.PRIMARY}/>
            </div>
            {error ?
                <p css={css`
                  color: ${colors.CONTRAST}
                `}>
                    {error}
                </p> :
                null
            }
        </div>
    );
}

export default UserInfoNewLanguageSelect;
