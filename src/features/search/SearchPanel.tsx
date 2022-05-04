/** @jsxImportSource @emotion/react */

import React, {FormEvent} from "react";
import Select from "react-select";
import {languageOptions, levelOptions, Option} from "../../resources/languages";
import {noBorderAndBgSelectDark, searchSelect} from "../../styles/components";
import {css} from "@emotion/react";
import {Search} from "iconoir-react";
import {colors, textSizes} from "../../styles/variables";
import {buttonWithoutBackgroundAndBorder} from "../../components/Button";
import {SearchParams, UserSearchResponse} from "./Search";
import {InfiniteData, QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";


const selectTypeOptions: Option[] = [
    {value: "all", label: "All"},
    {value: "users", label: "Users"},
    {value: "channels", label: "Channels"},
];

interface SearchPanelProps {
    searchParamsRef: React.MutableRefObject<SearchParams | null>;
    refetch: <TPageData>(options?: ((RefetchOptions & RefetchQueryFilters<TPageData>) | undefined)) => Promise<QueryObserverResult<InfiniteData<UserSearchResponse>, unknown>>;
}

function SearchPanel(props: SearchPanelProps) {

    const [inputValue, setInputValue] = React.useState<string>("");
    const [nativeLanguages, setNativeLanguages] = React.useState<Option[] | null>(null);
    const [learningLanguages, setLearningLanguages] = React.useState<Option[] | null>(null);
    const [learningLanguagesLevel, setLearningLanguagesLevel] = React.useState<Option | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.searchParamsRef.current = {
            search: inputValue
        };
        props.refetch();
    };

    return (
        <form onSubmit={handleSubmit}
              css={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
              `}>
            <div css={css`
              display: flex;
              width: auto;
              justify-content: space-between;
              align-items: center;
              gap: 1rem;
              background-color: ${colors.LIGHT};
              padding: 0.25rem 0.5rem;
              border-radius: 3px;
            `}>
                {/* Search input. */}
                <input type="search" name="search-query" placeholder="Search..."
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       css={css`
                         background: none;
                         outline: none;
                         border: none;
                         width: auto;
                         font-size: ${textSizes.M};
                       `}/>
                <div css={css`
                  display: flex;
                  align-items: center;
                `}>
                    {/* Search type select. Allows the user to choose between searching for users and for channels. */}
                    <Select id={`search-type`}
                            options={selectTypeOptions}
                            placeholder="Type"
                            styles={noBorderAndBgSelectDark}
                    />

                    {/* Submit button. */}
                    <button type="submit"
                            css={buttonWithoutBackgroundAndBorder}
                    >
                        <Search color={colors.PRIMARY} width={"1.5rem"} height={"1.5rem"}/>
                    </button>
                </div>
            </div>

            {/* Native languages multi-select.
             Automatically disables options which are selected as learning languages. */}
            <Select id={`native-languages`} isMulti={true}
                    value={nativeLanguages}
                    options={languageOptions}
                    onChange={(options: any) => setNativeLanguages(options)}
                    isOptionDisabled={(option) => !!learningLanguages?.includes(option as Option)}
                    placeholder="Native languages"
                    styles={searchSelect}
            />

            {/* Learning languages multi-select.
             Automatically disables options which are selected as native languages. */}
            <Select id={`learning-languages`} isMulti={true}
                    value={learningLanguages}
                    options={languageOptions}
                    onChange={(options: any) => setLearningLanguages(options)}
                    isOptionDisabled={(option) => !!nativeLanguages?.includes(option as Option)}
                    placeholder="Learning languages"
                    styles={searchSelect}
            />

            {/* Learning languages level select. */}
            <Select id={`learning-languages-level`}
                    value={learningLanguagesLevel}
                    options={levelOptions}
                    onChange={(option: any) => setLearningLanguagesLevel(option)}
                    placeholder="Learning languages level"
                    styles={searchSelect}
            />
        </form>
    );
}

export default SearchPanel;
