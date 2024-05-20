import { FlagIcon } from "react-flag-kit";
import { COLORS, LANGUAGE_INFO, LEVEL_NAMES } from "../constants";
import { Language, ProficiencyLevel } from "../types";
import Badge from "./Badge";
import ProficiencyLevelIcon from "./Icons/ProficiencyLevelIcon";

interface LanguageBadgeProps {
  language: Language;
  level: ProficiencyLevel;
  backgroundColor: string;
}

/**
 * Renders a badge with the specified language and level names and icons, plus
 * the specified background color.
 */
const LanguageBadge = ({
  language,
  level,
  backgroundColor,
}: LanguageBadgeProps) => {
  const levelDisplayName = LEVEL_NAMES[level];
  const languageInfo = LANGUAGE_INFO[language];

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
      <span>{levelDisplayName}</span>
    </Badge>
  );
};

export default LanguageBadge;
