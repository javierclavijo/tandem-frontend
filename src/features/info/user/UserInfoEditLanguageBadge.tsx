/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Xmark } from "iconoir-react";
import React from "react";
import { FlagIcon } from "react-flag-kit";
import { useMutation, useQueryClient } from "react-query";
import Select, { SingleValue, StylesConfig } from "react-select";
import Button from "../../../components/Button";
import ProficiencyLevelIcon from "../../../components/Icons/ProficiencyLevelIcon";
import {
  Option,
  flagCodes,
  languages,
  levelOptions,
} from "../../../resources/languages";
import { badge, noBorderAndBgSelectWhite } from "../../../styles/components";
import { colors } from "../../../styles/variables";
import useAuth, { axiosApi } from "../../auth/AuthContext";
import { User } from "../../common/types";
import { UserLanguage } from "../types";

interface LanguageBadgeProps {
  data: UserLanguage;
  bg: string;
  onDelete: () => void;
}

/**
 * Badge-like component for user info view. Displays a language's name and icon and allows
 * selecting the language's level.
 */
function UserInfoEditLanguageBadge({ data, bg, onDelete }: LanguageBadgeProps) {
  const queryClient = useQueryClient();
  const [value, setValue] = React.useState<Option | null>(null);
  const { user } = useAuth();

  const updateRequest = React.useCallback(
    async (requestData: { level: string }) => {
      if (data) {
        const response = await axiosApi.patch(data.url, requestData);
        return response.data;
      }
    },
    [data],
  );

  const mutation = useMutation(updateRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<User | undefined>([
        "users",
        user?.id,
      ]);
    },
  });

  const onChange = async (option: SingleValue<Option>) => {
    if (option != null) {
      const requestData = { level: option.value as string };
      await mutation.mutateAsync(requestData);
      setValue(option);
    }
  };

  React.useEffect(() => {
    // Get the option which corresponds to the initial value prop and set it as the select's value
    const initialOption = levelOptions.find((o) => o.value === data.level);
    if (initialOption) {
      setValue(initialOption);
    }
  }, [data.level]);

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
      <span>{languages.find((l) => l.key === data.language)?.value}</span>
      <span>|</span>
      <ProficiencyLevelIcon
        level={data.level}
        color={colors.WHITE}
        height={24}
        width={24}
      />
      <Select<Option>
        id={`level-${data.id}`}
        value={value}
        onChange={onChange}
        options={levelOptions}
        styles={noBorderAndBgSelectWhite as StylesConfig<Option>}
      />
      <Button visible={true} onClick={onDelete}>
        <Xmark color={colors.WHITE} width={"1.5rem"} height={"1.5rem"} />
      </Button>
    </div>
  );
}

export default UserInfoEditLanguageBadge;
