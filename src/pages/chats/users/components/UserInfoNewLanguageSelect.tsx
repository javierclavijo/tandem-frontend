import { css } from "@emotion/react";
import { useCallback, useState } from "react";
import Select, { StylesConfig } from "react-select";
import EditButtons from "../../../../common/components/EditButtons";
import { select } from "../../../../common/components/styles";
import {
  COLORS,
  languageOptionsArray,
  levelOptionsArray,
} from "../../../../common/constants";
import useAuth from "../../../../common/context/AuthContext/AuthContext";
import { Language, Option, ProficiencyLevel } from "../../../../common/types";
import { useCreateUserLanguageMutation } from "../queries";

interface UserInfoNewLanguageSelectProps {
  onClose: () => void;
}

/**
 * Contains controls to allow the user to add a new language to their profile.
 */
const UserInfoNewLanguageSelect = ({
  onClose,
}: UserInfoNewLanguageSelectProps) => {
  const { user } = useAuth();

  const mutation = useCreateUserLanguageMutation(user?.id);

  // TODO: use RHF, move this stuff to NewLanguageModal
  const [languageValue, setLanguageValue] = useState<Option<Language> | null>(
    null,
  );
  const [levelValue, setLevelValue] = useState<Option<ProficiencyLevel> | null>(
    null,
  );
  const [error, setError] = useState<string>("");

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
        <Select<Option<Language>>
          id={`language-new`}
          value={languageValue}
          onChange={setLanguageValue}
          onFocus={clearError}
          options={languageOptionsArray}
          isOptionDisabled={(option) =>
            // Disable the options for languages the user already has.
            !!user?.languages.find(
              (language) => language.language === option.value,
            )
          }
          placeholder="Language"
          styles={select as StylesConfig<Option<Language>>}
        />
        <Select<Option<ProficiencyLevel>>
          id={`level-new`}
          value={levelValue}
          onChange={setLevelValue}
          onFocus={clearError}
          options={levelOptionsArray}
          placeholder="Level"
          styles={select as StylesConfig<Option<ProficiencyLevel>>}
        />

        {/* TODO: substitute for regular buttons */}
        <EditButtons
          handleSubmit={handleSubmit}
          handleCancel={onClose}
          color={COLORS.PRIMARY}
        />
      </div>
      {error ? <p css={errorText}>{error}</p> : null}
    </div>
  );
};

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
