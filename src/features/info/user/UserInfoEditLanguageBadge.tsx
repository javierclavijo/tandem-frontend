/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import { FlagIcon } from "react-flag-kit";
import { colors } from "../../../styles/variables";
import {
  flagCodes,
  languages,
  levelOptions,
  Option,
} from "../../../resources/languages";
import { badge, noBorderAndBgSelectWhite } from "../../../styles/components";
import { User, UserLanguage } from "../../../entities/User";
import { useMutation, useQueryClient } from "react-query";
import useAuth, { axiosApi } from "../../auth/AuthContext";
import Select from "react-select";
import Button from "../../../components/Button";
import ProficiencyLevelIcon from "../../../components/Icons/ProficiencyLevelIcon";
import { Cancel } from "iconoir-react";

interface LanguageBadgeProps {
  data: UserLanguage;
  bg: string;
  onDelete: () => void;
}

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
    [data]
  );

  const mutation = useMutation(updateRequest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries<User | undefined>([
        "users",
        user?.id,
      ]);
    },
  });

  const onChange = async (option: any) => {
    const requestData = { level: option.value as string };
    await mutation.mutateAsync(requestData);
    setValue(option);
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
    <div
      css={container}
    >
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
      <Select
        id={`level-${data.id}`}
        value={value}
        onChange={onChange}
        options={levelOptions}
        styles={noBorderAndBgSelectWhite}
      />
      <Button visible={true} onClick={onDelete}>
        <Cancel color={colors.WHITE} width={"1.5rem"} height={"1.5rem"} />
      </Button>
    </div>
  );
}

export default UserInfoEditLanguageBadge;
