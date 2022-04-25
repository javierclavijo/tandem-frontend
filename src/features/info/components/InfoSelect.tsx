/** @jsxImportSource @emotion/react */

import React from "react";
import {languageItem} from "../channel/styles";
import Select, {StylesConfig} from "react-select";
import {colors} from "../../../styles/variables";

interface Option {
    value: string,
    label: string;
}

export const languageOptions: Option[] = [
    {value: "EN", label: "English"},
    {value: "FR", label: "French"},
    {value: "DE", label: "German"},
    {value: "IT", label: "Italian"},
    {value: "ES", label: "Spanish"}
];

export const levelOptions: Option[] = [
    {value: "BE", label: "Beginner"},
    {value: "IN", label: "Intermediate"},
    {value: "AD", label: "Advanced"}
];

interface LanguageOrLevelSelectProps {
    id: string;
    label: string;
    initialValue: string;
    options: Option[];
}


function InfoSelect({id, label, initialValue, options}: LanguageOrLevelSelectProps) {
    const [value, setValue] = React.useState<Option | null>(null);

    const handleChange = (option: any) => {
        setValue(option);
    };

    React.useEffect(() => {
        // Get the option which corresponds to the initial value prop and set it as the select's value
        const initialOption = options.find(o => o.value === initialValue);
        if (initialOption) {
            setValue(initialOption);
        }
    }, [initialValue, options]);

    const styles: StylesConfig = {
        option: (provided, state) => ({
            ...provided,
            color: colors.DARK
        })
    };

    return value ?
        <div css={languageItem}>
            <label htmlFor={id}>{label}</label>
            <Select id={id}
                    value={value}
                    onChange={handleChange}
                    options={options}
                    styles={styles}
            />
        </div>
        : null;
}

export default InfoSelect;