import { css } from "@emotion/react";
import { Xmark } from "iconoir-react";
import { useEffect, useState } from "react";
import { FlagIcon } from "react-flag-kit";
import Select, { SingleValue, StylesConfig } from "react-select";
import {
  LANGUAGE_INFO,
  levelOptions,
} from "../../../../common/resources/languages";
import { COLORS } from "../../../../common/resources/style-variables";
import { Option, ProficiencyLevel } from "../../../../common/types";
import Button from "../../../../components/Button";
import ProficiencyLevelIcon from "../../../../components/icons/ProficiencyLevelIcon";
import { badge, noBorderAndBgSelectWhite } from "../../../../components/styles";
import { UserLanguage } from "../../types";
import { useUpdateUserLanguageMutation } from "../queries";

interface LanguageBadgeProps {
  data: UserLanguage;
  bg: string;
  onDelete: () => void;
}

/**
 * Badge-like component for user info view. Displays a language's name and icon
 * and allows selecting the language's level.
 */
function UserInfoEditLanguageBadge({ data, bg, onDelete }: LanguageBadgeProps) {
  const [levelValue, setLevelValue] = useState<Option<ProficiencyLevel> | null>(
    null,
  );

  const mutation = useUpdateUserLanguageMutation(data.url);

  const onChange = async (option: SingleValue<Option<ProficiencyLevel>>) => {
    if (option != null) {
      const requestData = { level: option.value };
      await mutation.mutateAsync(requestData);
      setLevelValue(option);
    }
  };

  useEffect(() => {
    // Get the option which corresponds to the initial value prop and set it as
    // the select's value
    const initialOption = levelOptions.find((o) => o.value === data.level);
    if (initialOption) {
      setLevelValue(initialOption);
    }
  }, [data.level]);

  // TODO: refactor this. Look for similar occurrences. (Probably should use
  // CSSProperties)
  const container = css`
    ${badge};
    background-color: ${bg};
  `;

  const languageInfo = LANGUAGE_INFO[data.language];

  return (
    <div css={container}>
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
      <Button onClick={onDelete}>
        <Xmark color={COLORS.WHITE} width={"1.5rem"} height={"1.5rem"} />
      </Button>
    </div>
  );
}

export default UserInfoEditLanguageBadge;
