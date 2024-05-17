import { Xmark } from "iconoir-react";
import { useState } from "react";
import { FlagIcon } from "react-flag-kit";
import Select, { SingleValue, StylesConfig } from "react-select";
import EditButton from "../../../../common/components/EditButton";
import ProficiencyLevelIcon from "../../../../common/components/icons/ProficiencyLevelIcon";
import {
  badge,
  noBorderAndBgSelectWhite,
} from "../../../../common/components/styles";
import {
  LANGUAGE_INFO,
  levelOptions,
} from "../../../../common/resources/languages";
import { COLORS } from "../../../../common/resources/style-variables";
import { Option, ProficiencyLevel } from "../../../../common/types";
import { UserLanguage } from "../../types";
import { useUpdateUserLanguageMutation } from "../queries";

interface LanguageBadgeProps {
  data: UserLanguage;
  backgroundColor: string;
  onDelete: () => void;
}

/**
 * Badge-like component for user info view. Displays a language's name and icon
 * and allows selecting the language's level.
 */
function UserInfoEditLanguageBadge({
  data,
  backgroundColor,
  onDelete,
}: LanguageBadgeProps) {
  const mutation = useUpdateUserLanguageMutation(data.url);

  const [levelValue, setLevelValue] = useState<Option<ProficiencyLevel> | null>(
    () => levelOptions.find((o) => o.value === data.level) ?? null,
  );

  const languageInfo = LANGUAGE_INFO[data.language];

  const onChange = async (option: SingleValue<Option<ProficiencyLevel>>) => {
    if (option != null) {
      const requestData = { level: option.value };
      await mutation.mutateAsync(requestData);
      setLevelValue(option);
    }
  };

  return (
    <div css={badge} style={{ backgroundColor }}>
      <FlagIcon code={languageInfo.flagIconCode} size={24} />
      <span>{languageInfo.displayName}</span>
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
        onChange={onChange}
        options={levelOptions}
        styles={
          noBorderAndBgSelectWhite as StylesConfig<Option<ProficiencyLevel>>
        }
      />
      <EditButton onClick={onDelete}>
        <Xmark color={COLORS.WHITE} width={"1.5rem"} height={"1.5rem"} />
      </EditButton>
    </div>
  );
}

export default UserInfoEditLanguageBadge;
