import { Xmark } from "iconoir-react";
import { useState } from "react";
import { FlagIcon } from "react-flag-kit";
import { SingleValue } from "react-select";
import Badge from "../../../../common/components/Badge";
import EditButton from "../../../../common/components/EditButton";
import ProficiencyLevelIcon from "../../../../common/components/Icons/ProficiencyLevelIcon";
import DropdownSelect from "../../../../common/components/Select/DropdownSelect";
import { LabelOption } from "../../../../common/components/Select/types";
import {
  COLORS,
  LANGUAGE_INFO,
  levelOptionsArray,
} from "../../../../common/constants";
import { Language, ProficiencyLevel } from "../../../../common/types";
import { useUpdateUserLanguageMutation } from "../queries";

interface LanguageBadgeProps {
  id: string;
  language: Language;
  level: ProficiencyLevel;
  url: string;
  backgroundColor: string;
  onDelete: () => void;
}

/**
 * Badge-like component for user info view. Displays a language's name and icon
 * and allows selecting the language's level.
 */
const UserInfoEditLanguageBadge = ({
  id,
  language,
  level,
  url,
  backgroundColor,
  onDelete,
}: LanguageBadgeProps) => {
  const mutation = useUpdateUserLanguageMutation(url);

  const [levelValue, setLevelValue] =
    useState<LabelOption<ProficiencyLevel> | null>(
      () => levelOptionsArray.find((o) => o.value === level) ?? null,
    );

  const languageInfo = LANGUAGE_INFO[language];

  const onChange = async (
    option: SingleValue<LabelOption<ProficiencyLevel>>,
  ) => {
    if (option != null) {
      const requestData = { level: option.value };
      await mutation.mutateAsync(requestData);
      setLevelValue(option);
    }
  };

  return (
    <Badge style={{ backgroundColor }}>
      <FlagIcon code={languageInfo.flagIconCode} size={24} />
      <span>{languageInfo.displayName}</span>
      <span>|</span>
      <ProficiencyLevelIcon
        level={level}
        color={COLORS.WHITE}
        height={24}
        width={24}
      />
      <DropdownSelect<LabelOption<ProficiencyLevel>>
        id={`level-${id}`}
        value={levelValue}
        onChange={onChange}
        options={levelOptionsArray}
      />
      <EditButton onClick={onDelete}>
        <Xmark color={COLORS.WHITE} width="1.5rem" height="1.5rem" />
      </EditButton>
    </Badge>
  );
};

export default UserInfoEditLanguageBadge;
