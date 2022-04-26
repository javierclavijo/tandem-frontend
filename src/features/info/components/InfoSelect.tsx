/** @jsxImportSource @emotion/react */

import React from "react";
import {languageItem} from "../channel/styles";
import Select, {StylesConfig} from "react-select";
import {colors} from "../../../styles/variables";

export interface Option {
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
    {value: "AD", label: "Advanced"},
    {value: "NA", label: "Native"},
];

interface LanguageOrLevelSelectProps {
    id: string;
    initialValue: string;
    options: Option[];
    handleSubmit: (option: Option) => Promise<any>;
}


function InfoSelect({id, initialValue, options, handleSubmit}: LanguageOrLevelSelectProps) {
    const [value, setValue] = React.useState<Option | null>(null);

    const onChange = async (option: any) => {
        await handleSubmit(option);
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
        <Select id={id}
                value={value}
                onChange={onChange}
                options={options}
                styles={styles}
        />
        : null;
}

export default InfoSelect;
