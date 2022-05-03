/** @jsxImportSource @emotion/react */

import React from "react";
import Select from "react-select";
import {languageOptions, levelOptions, Option} from "../../resources/languages";
import {noBorderAndBgSelectDark, searchSelect} from "../../styles/components";
import {css} from "@emotion/react";
import {Search} from "iconoir-react";
import {colors, textSizes} from "../../styles/variables";
import {buttonWithoutBackgroundAndBorder} from "../../components/Button";


const selectTypeOptions: Option[] = [
    {value: "all", label: "All"},
    {value: "users", label: "Users"},
    {value: "channels", label: "Channels"},
];

interface SearchPanelProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

function SearchPanel(props: SearchPanelProps) {

    const [inputValue, setInputValue] = React.useState<string>("");

    const handleSearch = () => {
        if (inputValue) {
            props.setSearchQuery(inputValue);
        }
    };

    return (
        <div css={css`
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
                <input type="text" name="search-query" placeholder="Search..."
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
                    <Select id={`search-type`}
                            options={selectTypeOptions}
                            placeholder="Type"
                            styles={noBorderAndBgSelectDark}
                    />
                    <button type="button"
                            onClick={handleSearch}
                            css={buttonWithoutBackgroundAndBorder}
                    >
                        <Search color={colors.PRIMARY} width={"1.5rem"} height={"1.5rem"}/>
                    </button>
                </div>
            </div>
            <div css={css`
              display: flex;
              gap: 1rem;
            `}>
                <Select id={`search-language`}
                        options={languageOptions}
                        placeholder="Language"
                        styles={searchSelect}
                />
                <Select id={`search-level`}
                        options={levelOptions}
                        placeholder="Level"
                        styles={searchSelect}
                />
            </div>
        </div>
    );
}

export default SearchPanel;
