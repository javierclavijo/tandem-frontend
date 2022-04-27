/** @jsxImportSource @emotion/react */

import React from "react";
import {css} from "@emotion/react";
import {FlagIcon} from "react-flag-kit";
import {ThreeStars} from "iconoir-react";
import {colors} from "../../../styles/variables";
import {flagCodes, languages} from "../../../resources/languages";
import {badge, badgeSelect} from "../../../styles/components";
import {User, UserLanguage} from "../../../entities/User";
import {levelOptions, Option} from "../components/InfoSelect";
import {useMutation, useQueryClient} from "react-query";
import {axiosApi} from "../../auth/AuthContext";
import Select from "react-select";
import EditButton from "../../../components/EditButton/EditButton";

interface LanguageBadgeProps {
    data: UserLanguage;
    bg: string;
    onDelete: () => void;
}

function UserInfoEditLanguageBadge({data, bg, onDelete}: LanguageBadgeProps) {

    const queryClient = useQueryClient();
    const [value, setValue] = React.useState<Option | null>(null);


    const updateRequest = React.useCallback(async (requestData: { level: string }) => {
        if (data) {
            const response = await axiosApi.patch(data.url, requestData);
            return response.data;
        }
    }, [data]);

    const mutation = useMutation(updateRequest, {
        onSuccess: async () => {
            await queryClient.invalidateQueries<User | undefined>(["users", "me"]);
        }
    });

    const onChange = async (option: any) => {
        const requestData = {level: option.value as string};
        await mutation.mutateAsync(requestData);
        setValue(option);
    };

    React.useEffect(() => {
        // Get the option which corresponds to the initial value prop and set it as the select's value
        const initialOption = levelOptions.find(o => o.value === data.level);
        if (initialOption) {
            setValue(initialOption);
        }
    }, [data.level]);


    return (
        <div css={css`${badge};
          background-color: ${bg}`}>
            <FlagIcon code={flagCodes.find(x => x.key === data.language)?.value || "AD"} size={24}/>
            <span>{languages.find(l => l.key === data.language)?.value}</span>
            <span>|</span>
            <ThreeStars color={colors.WHITE} height={24} width={24}/>
            <Select id={`level-${data.id}`}
                    value={value}
                    onChange={onChange}
                    options={levelOptions}
                    styles={badgeSelect}
            />
            <EditButton type={"cancel"} visible={true}
                        onClick={onDelete}
                        color={colors.WHITE}/>
        </div>
    );
}

export default UserInfoEditLanguageBadge;
