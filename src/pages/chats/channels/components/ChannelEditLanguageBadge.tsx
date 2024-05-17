import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { FlagIcon } from "react-flag-kit";
import Select, { StylesConfig } from "react-select";
import ProficiencyLevelIcon from "../../../../common/components/icons/ProficiencyLevelIcon";
import {
  badge,
  noBorderAndBgSelectWhite,
} from "../../../../common/components/styles";
import {
  COLORS,
  LANGUAGE_INFO,
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
} from "../../../../common/constants";
import { Language, Option, ProficiencyLevel } from "../../../../common/types";
import { UserLanguage } from "../../types";
import { useUpdateLanguageMutation } from "../queries";

interface LanguageBadgeProps {
  data: UserLanguage;
  bg: string;
}

// TODO: review this and the other badge components. Are they duplicated?
/**
 * Badge-like component for channel detail view. Displays the channel's
 * language's name and icon and allows selecting the language and level.
 */
function ChannelEditLanguageBadge({ data, bg }: LanguageBadgeProps) {
  // TODO: use RHF
  const [languageValue, setLanguageValue] = useState<Option<Language> | null>(
    null,
  );
  const [levelValue, setLevelValue] = useState<Option<ProficiencyLevel> | null>(
    null,
  );

  const updateMutation = useUpdateLanguageMutation(data?.id);

  // TODO: abstract union type
  const handleLanguageChange = async (option: Option<Language> | null) => {
    if (option == null) {
      return;
    }

    await updateMutation.mutateAsync({ url: data.url, language: option.value });
  };

  const handleLevelChange = async (option: Option<ProficiencyLevel> | null) => {
    if (option == null) {
      return;
    }

    await updateMutation.mutateAsync({ url: data.url, level: option.value });
  };

  // TODO: this should be cleaned up once the form has been refactored using RHF.
  useEffect(() => {
    // Get the options which correspond to the data values and set them as the
    // selects' values
    const initialLevelOption = LEVEL_OPTIONS.find(
      (o) => o.value === data.level,
    );
    const initialLanguageOption = LANGUAGE_OPTIONS.find(
      (o) => o.value === data.language,
    );
    if (initialLevelOption && initialLanguageOption) {
      setLevelValue(initialLevelOption);
      setLanguageValue(initialLanguageOption);
    }
  }, [data.language, data.level]);

  // TODO: refactor
  const container = css`
    ${badge};
    background-color: ${bg};
  `;

  const languageInfo = LANGUAGE_INFO[data.language];

  return (
    <div css={container}>
      <FlagIcon code={languageInfo.flagIconCode} size={24} />
      <Select<Option<Language>>
        id={`language-${data.id}`}
        value={languageValue}
        onChange={async (option) => {
          // TODO: move handlers like this one to component body.
          setLanguageValue(option);
          await handleLanguageChange(option);
        }}
        options={LANGUAGE_OPTIONS}
        styles={noBorderAndBgSelectWhite as StylesConfig<Option<Language>>}
      />
      <span>|</span>
      <ProficiencyLevelIcon
        level={data.level}
        color={COLORS.WHITE}
        height={24}
        width={24}
      />
      <Select<Option<ProficiencyLevel>>
        id={`level-${data.id}`}
        value={levelValue}
        onChange={async (option) => {
          setLevelValue(option);
          await handleLevelChange(option);
        }}
        options={LEVEL_OPTIONS}
        styles={
          noBorderAndBgSelectWhite as StylesConfig<Option<ProficiencyLevel>>
        }
      />
    </div>
  );
}

export default ChannelEditLanguageBadge;
