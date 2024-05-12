/** @jsxImportSource @emotion/react */

import React from "react";
import useAuth, { axiosApi } from "../../auth/AuthContext";
import { useMutation, useQueryClient } from "react-query";
import { css } from "@emotion/react";
import Select from "react-select";
import { colors } from "../../../styles/variables";
import { User } from "../../../entities/User";
import { select } from "../../../styles/components";
import EditButtons from "../../../components/EditButtons";
import {
  languageOptions,
  levelOptions,
  Option,
} from "../../../resources/languages";

interface UserInfoNewLanguageSelectRequestData {
  language: string;
  level: string;
  user: string;
}

/**
 * Contains controls to allow the user to add a new language to their profile.
 */
function UserInfoNewLanguageSelect({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [languageValue, setLanguageValue] = React.useState<Option | null>(null);
  const [levelValue, setLevelValue] = React.useState<Option | null>(null);
  const [error, setError] = React.useState<string>("");

  const updateRequest = async (
    requestData: UserInfoNewLanguageSelectRequestData,
  ) => {
    const response = await axiosApi.post("user_languages/", requestData);
    return response.data;
  };

  const mutation = useMutation(updateRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<User | undefined>([
        "users",
        user?.id,
      ]);
    },
  });

  const clearError = () => setError("");

  const handleSubmit = React.useCallback(async () => {
    if (!languageValue || !levelValue) {
      setError("Language and level must be selected.");
      return false;
    } else if (user) {
      const requestData = {
        user: user?.url,
        language: languageValue.value,
        level: levelValue.value,
      };
      await mutation.mutateAsync(requestData);
      onClose();
      return true;
    }
    return false;
  }, [languageValue, levelValue, mutation, onClose, user]);

  return (
    <div css={outerContainer}>
      <div css={innerContainer}>
        <Select
          id={`language-new`}
          value={languageValue}
          onChange={(option: any) => setLanguageValue(option)}
          onFocus={clearError}
          options={languageOptions}
          isOptionDisabled={(option: any) =>
            // Disable the options for languages the user already has
            !!user?.languages.find(
              (language) => language.language === option.value,
            )
          }
          placeholder="Language"
          styles={select}
        />
        <Select
          id={`level-new`}
          value={levelValue}
          onChange={(option: any) => setLevelValue(option)}
          onFocus={clearError}
          options={levelOptions}
          placeholder="Level"
          styles={select}
        />
        <EditButtons
          editEnabled={true}
          handleSubmit={handleSubmit}
          handleCancel={onClose}
          color={colors.PRIMARY}
        />
      </div>
      {error ? <p css={errorText}>{error}</p> : null}
    </div>
  );
}

const outerContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const innerContainer = css`
  display: flex;
  gap: 1rem;
`;

const errorText = css`
  color: ${colors.CONTRAST};
`;

export default UserInfoNewLanguageSelect;
