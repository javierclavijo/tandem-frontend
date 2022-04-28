/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {FlagIcon} from "react-flag-kit";
import {ThreeStars} from "iconoir-react";
import {colors} from "../../../styles/variables";
import {flagCodes} from "../../../resources/languages";
import {badge, badgeSelect} from "../../../styles/components";
import {UserLanguage} from "../../../entities/User";
import {languageOptions, levelOptions, Option} from "../components/InfoSelect";
import {useMutation, useQueryClient} from "react-query";
import {axiosApi} from "../../auth/AuthContext";
import Select from "react-select";
import {Channel} from "../../../entities/Channel";

interface LanguageBadgeProps {
    data: UserLanguage;
    bg: string;
}

function UserInfoEditLanguageBadge({data, bg}: LanguageBadgeProps) {

    const queryClient = useQueryClient();
    const [languageValue, setLanguageValue] = React.useState<Option | null>(null);
    const [levelValue, setLevelValue] = React.useState<Option | null>(null);


    const updateRequest = React.useCallback(async (requestData: { language: string }) => {
        if (data) {
            const response = await axiosApi.patch(data?.url, requestData);
            return response.data;
        }
    }, [data]);

    const updateMutation = useMutation(updateRequest, {
        onSuccess: async () => {
            await queryClient.invalidateQueries<Channel | undefined>(["channels", data?.id]);
        }
    });

    const handleChange = async (option: Option, key: keyof Channel) => {
        const requestData = {} as any;
        requestData[key] = option.value;
        await updateMutation.mutateAsync(requestData);
    };

    React.useEffect(() => {
        // Get the options which correspond to the data values and set them as the selects' values
        const initialLevelOption = levelOptions.find(o => o.value === data.level);
        const initialLanguageOption = languageOptions.find(o => o.value === data.language);
        if (initialLevelOption && initialLanguageOption) {
            setLevelValue(initialLevelOption);
            setLanguageValue(initialLanguageOption);
        }
    }, [data.language, data.level]);


    return (
        <div css={css`${badge};
          background-color: ${bg}`}>
            <FlagIcon code={flagCodes.find(x => x.key === data.language)?.value || "AD"} size={24}/>
            <Select id={`language-${data.id}`}
                    value={languageValue}
                    onChange={async (option: any) => {
                        setLanguageValue(option);
                        await handleChange(option, "language");
                    }}
                    options={languageOptions}
                    styles={badgeSelect}
            />
            <span>|</span>
            <ThreeStars color={colors.WHITE} height={24} width={24}/>
            <Select id={`level-${data.id}`}
                    value={levelValue}
                    onChange={async (option: any) => {
                        setLevelValue(option);
                        await handleChange(option, "level");
                    }}
                    options={levelOptions}
                    styles={badgeSelect}
            />
        </div>
    );
}

export default UserInfoEditLanguageBadge;
