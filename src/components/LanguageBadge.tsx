import { css } from "@emotion/react";
import { FlagIcon } from "react-flag-kit";
import { Language, ProficiencyLevel } from "../features/common/types";
import { LANGUAGE_INFO, LEVEL_NAMES } from "../resources/languages";
import { COLORS } from "../resources/style-variables";
import ProficiencyLevelIcon from "./icons/ProficiencyLevelIcon";
import { badge } from "./styles";

interface LanguageBadgeProps {
  language: Language;
  level: ProficiencyLevel;
  bg: string;
}

/**
 * Renders a badge with the specified language and level names and icons, plus
 * the specified background color.
 */
function LanguageBadge({ language, level, bg }: LanguageBadgeProps) {
  const container = css`
    ${badge};
    background-color: ${bg};
  `;

  const levelDisplayName = LEVEL_NAMES[level];
  const languageInfo = LANGUAGE_INFO[language];

  return (
    <div css={container}>
      <FlagIcon code={languageInfo.flagIconCode} size={24} />
      <span>{languageInfo.displayName}</span>
      <span>|</span>
      <ProficiencyLevelIcon
        level={level}
        color={COLORS.WHITE}
        height={24}
        width={24}
      />
      <span>{levelDisplayName}</span>
    </div>
  );
}

export default LanguageBadge;
