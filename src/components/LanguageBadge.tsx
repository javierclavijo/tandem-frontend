/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import { FlagIcon } from "react-flag-kit";
import { colors } from "../styles/variables";
import { flagCodes, languages, levels } from "../resources/languages";
import { badge } from "../styles/components";
import ProficiencyLevelIcon from "./Icons/ProficiencyLevelIcon";

interface LanguageBadgeProps {
  language: string;
  level: string;
  bg: string;
}

function LanguageBadge({ language, level, bg }: LanguageBadgeProps) {
  const container = css`
    ${badge};
    background-color: ${bg};
  `;

  return (
    <div css={container}>
      <FlagIcon
        code={flagCodes.find((x) => x.key === language)?.value || "AD"}
        size={24}
      />
      <span>{languages.find((l) => l.key === language)?.value}</span>
      <span>|</span>
      <ProficiencyLevelIcon
        level={level}
        color={colors.WHITE}
        height={24}
        width={24}
      />
      <span>{levels.find((l) => l.key === level)?.value}</span>
    </div>
  );
}

export default LanguageBadge;
