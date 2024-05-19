import { useEffect, useState } from "react";
import { FlagIcon } from "react-flag-kit";
import Badge from "../../../../common/components/Badge";
import DropdownSelect from "../../../../common/components/Select/DropdownSelect";
import { LabelOption } from "../../../../common/components/Select/types";
import ProficiencyLevelIcon from "../../../../common/components/icons/ProficiencyLevelIcon";
import {
  COLORS,
  LANGUAGE_INFO,
  languageOptionsArray,
  levelOptionsArray,
} from "../../../../common/constants";
import { Language, ProficiencyLevel } from "../../../../common/types";
import { UserLanguage } from "../../types";
import { useUpdateLanguageMutation } from "../queries";

interface LanguageBadgeProps {
  data: UserLanguage;
  backgroundColor: string;
}

/**
 * Badge-like component for channel detail view. Displays the channel's
 * language's name and icon and allows selecting the language and level.
 */
const ChannelEditLanguageBadge = ({
  data,
  backgroundColor,
}: LanguageBadgeProps) => {
  const [languageValue, setLanguageValue] =
    useState<LabelOption<Language> | null>(null);
  const [levelValue, setLevelValue] =
    useState<LabelOption<ProficiencyLevel> | null>(null);

  const updateMutation = useUpdateLanguageMutation(data?.id);

  const handleLanguageChange = async (option: LabelOption<Language> | null) => {
    if (option == null) {
      return;
    }

    await updateMutation.mutateAsync({ url: data.url, language: option.value });
  };

  const handleLevelChange = async (
    option: LabelOption<ProficiencyLevel> | null,
  ) => {
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
      <DropdownSelect<LabelOption<Language>>
        id={`language-${data.id}`}
        value={languageValue}
        onChange={async (option) => {
          setLanguageValue(option);
          await handleLanguageChange(option);
        }}
        options={languageOptionsArray}
      />
      <span>|</span>
      <ProficiencyLevelIcon
        level={data.level}
        color={COLORS.WHITE}
        height={24}
        width={24}
      />
      <DropdownSelect<LabelOption<ProficiencyLevel>>
        id={`level-${data.id}`}
        value={levelValue}
        onChange={async (option) => {
          setLevelValue(option);
          await handleLevelChange(option);
        }}
        options={levelOptionsArray}
      />
    </Badge>
  );
};

export default ChannelEditLanguageBadge;
