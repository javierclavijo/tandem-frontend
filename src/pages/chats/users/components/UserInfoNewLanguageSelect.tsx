import { css } from "@emotion/react";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Select, { StylesConfig } from "react-select";
import { axiosApi } from "../../../../api";
import {
  languageOptions,
  levelOptions,
} from "../../../../common/resources/languages";
import { COLORS } from "../../../../common/resources/style-variables";
import { Option, ProficiencyLevel, User } from "../../../../common/types";
import EditButtons from "../../../../components/EditButtons";
import { select } from "../../../../components/styles";
import useAuth from "../../../auth/AuthContext/AuthContext";

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

  const [languageValue, setLanguageValue] = useState<Option | null>(null);
  const [levelValue, setLevelValue] = useState<Option<ProficiencyLevel> | null>(
    null,
  );
  const [error, setError] = useState<string>("");

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

  const handleSubmit = useCallback(async () => {
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
        <Select<Option>
          id={`language-new`}
          value={languageValue}
          onChange={setLanguageValue}
          onFocus={clearError}
          options={languageOptions}
          isOptionDisabled={(option) =>
            // Disable the options for languages the user already has.
            !!user?.languages.find(
              (language) => language.language === option.value,
            )
          }
          placeholder="Language"
          styles={select as StylesConfig<Option>}
        />
        <Select<Option<ProficiencyLevel>>
          id={`level-new`}
          value={levelValue}
          onChange={setLevelValue}
          onFocus={clearError}
          options={levelOptions}
          placeholder="Level"
          styles={select as StylesConfig<Option<ProficiencyLevel>>}
        />
        <EditButtons
          editEnabled={true}
          handleSubmit={handleSubmit}
          handleCancel={onClose}
          color={COLORS.PRIMARY}
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
  color: ${COLORS.CONTRAST};
`;

export default UserInfoNewLanguageSelect;
