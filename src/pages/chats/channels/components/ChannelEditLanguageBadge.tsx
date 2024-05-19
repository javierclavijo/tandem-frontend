import { useEffect, useState } from "react";
import { FlagIcon } from "react-flag-kit";
import Select, { StylesConfig } from "react-select";
import Badge from "../../../../common/components/Badge";
import ProficiencyLevelIcon from "../../../../common/components/icons/ProficiencyLevelIcon";
import { noBorderAndBgSelectWhite } from "../../../../common/components/styles";
import {
  COLORS,
  LANGUAGE_INFO,
  languageOptionsArray,
  levelOptionsArray,
} from "../../../../common/constants";
import { Language, Option, ProficiencyLevel } from "../../../../common/types";
import { UserLanguage } from "../../types";
import { useUpdateLanguageMutation } from "../queries";

interface LanguageBadgeProps {
  data: UserLanguage;
  backgroundColor: string;
}

// TODO: review this and the other badge components. Are they duplicated?
/**
 * Badge-like component for channel detail view. Displays the channel's
 * language's name and icon and allows selecting the language and level.
 */
const ChannelEditLanguageBadge = ({
  data,
  backgroundColor,
}: LanguageBadgeProps) => {
  // TODO: use RHF
  const [languageValue, setLanguageValue] = useState<Option<Language> | null>(
    null,
  );
  const [levelValue, setLevelValue] = useState<Option<ProficiencyLevel> | null>(
    null,
  );

  const updateMutation = useUpdateLanguageMutation(data?.id);

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

  useEffect(() => {
    // Get the options which correspond to the data values and set them as the
    // selects' values
    const initialLevelOption = levelOptionsArray.find(
      (o) => o.value === data.level,
    );
    const initialLanguageOption = languageOptionsArray.find(
      (o) => o.value === data.language,
    );
    if (initialLevelOption && initialLanguageOption) {
      setLevelValue(initialLevelOption);
      setLanguageValue(initialLanguageOption);
    }
  }, [data.language, data.level]);

  const languageInfo = LANGUAGE_INFO[data.language];

  return (
    <Badge style={{ backgroundColor }}>
      <FlagIcon code={languageInfo.flagIconCode} size={24} />
      <Select<Option<Language>>
        id={`language-${data.id}`}
        value={languageValue}
        onChange={async (option) => {
          setLanguageValue(option);
          await handleLanguageChange(option);
        }}
        options={languageOptionsArray}
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
        options={levelOptionsArray}
        styles={
          noBorderAndBgSelectWhite as StylesConfig<Option<ProficiencyLevel>>
        }
      />
    </Badge>
  );
};

export default ChannelEditLanguageBadge;
