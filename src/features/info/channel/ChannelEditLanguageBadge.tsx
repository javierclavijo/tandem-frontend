/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React from "react";
import { FlagIcon } from "react-flag-kit";
import { useMutation, useQueryClient } from "react-query";
import Select, { StylesConfig } from "react-select";
import ProficiencyLevelIcon from "../../../components/Icons/ProficiencyLevelIcon";
import {
  Option,
  flagCodes,
  languageOptions,
  levelOptions,
} from "../../../resources/languages";
import { badge, noBorderAndBgSelectWhite } from "../../../styles/components";
import { colors } from "../../../styles/variables";
import { axiosApi } from "../../auth/AuthContext";
import { Channel } from "../../common/types";
import { UserLanguage } from "../types";

interface LanguageBadgeProps {
  data: UserLanguage;
  bg: string;
}

interface UpdateRequest {
  language?: string;
  level?: string;
}

/**
 * Badge-like component for channel detail view. Displays the channel's language's name and icon and allows
 * selecting the language and level.
 */
function UserInfoEditLanguageBadge({ data, bg }: LanguageBadgeProps) {
  const queryClient = useQueryClient();
  const [languageValue, setLanguageValue] = React.useState<Option | null>(null);
  const [levelValue, setLevelValue] = React.useState<Option | null>(null);

  const updateRequest = React.useCallback(
    async (requestData: UpdateRequest) => {
      if (data) {
        const response = await axiosApi.patch(data?.url, requestData);
        return response.data;
      }
    },
    [data],
  );

  const updateMutation = useMutation(updateRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<Channel | undefined>([
        "channels",
        data?.id,
      ]);
    },
  });

  // TODO: abstractunion type
  const handleLanguageChange = async (option: Option | null) => {
    if (option == null) {
      return;
    }

    await updateMutation.mutateAsync({ language: option.value });
  };

  const handleLevelChange = async (option: Option | null) => {
    if (option == null) {
      return;
    }

    await updateMutation.mutateAsync({ level: option.value });
  };

  React.useEffect(() => {
    // Get the options which correspond to the data values and set them as the selects' values
    const initialLevelOption = levelOptions.find((o) => o.value === data.level);
    const initialLanguageOption = languageOptions.find(
      (o) => o.value === data.language,
    );
    if (initialLevelOption && initialLanguageOption) {
      setLevelValue(initialLevelOption);
      setLanguageValue(initialLanguageOption);
    }
  }, [data.language, data.level]);

  const container = css`
    ${badge};
    background-color: ${bg};
  `;
  return (
    <div css={container}>
      <FlagIcon
        code={flagCodes.find((x) => x.key === data.language)?.value || "AD"}
        size={24}
      />
      <Select<Option>
        id={`language-${data.id}`}
        value={languageValue}
        onChange={async (option) => {
          setLanguageValue(option);
          await handleLanguageChange(option);
        }}
        options={languageOptions}
        styles={noBorderAndBgSelectWhite as StylesConfig<Option>}
      />
      <span>|</span>
      <ProficiencyLevelIcon
        level={data.level}
        color={colors.WHITE}
        height={24}
        width={24}
      />
      <Select<Option>
        id={`level-${data.id}`}
        value={levelValue}
        onChange={async (option) => {
          setLevelValue(option);
          await handleLevelChange(option);
        }}
        options={levelOptions}
        styles={noBorderAndBgSelectWhite as StylesConfig<Option>}
      />
    </div>
  );
}

export default UserInfoEditLanguageBadge;
