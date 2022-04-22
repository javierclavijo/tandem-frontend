import React, {useMemo} from "react";
import {Channel} from "../../entities/Channel";

interface UseEditType<T> {
    editEnabled: boolean;
    setEditEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    clearError: () => void;
    elementRef: React.MutableRefObject<T | null>;
    submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    handleChange: (e: React.ChangeEvent<T>) => void;
    handleFocus: () => void;
    handleCancel: () => void;
}

export function useEdit<T extends (HTMLInputElement | HTMLTextAreaElement)>(
    data: Channel | undefined,
    dataKey: "name" | "description"
): UseEditType<T> {
    const [editEnabled, setEditEnabled] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    const elementRef = React.useRef<T>(null);
    const submitButtonRef = React.useRef<HTMLButtonElement>(null);


    const clearError = React.useCallback(() => {
        if (error) {
            setError("");
        }
    }, [error]);

    const updateInputValue = React.useCallback(() => {
        if (data?.[dataKey]) {
            setValue(data?.[dataKey]);
        }
    }, [data, dataKey]);

    // Set data on init and whenever data changes (i.e. after submitting)
    React.useEffect(updateInputValue, [data?.[dataKey], updateInputValue]);


    const handleChange = React.useCallback((e: React.ChangeEvent<T>) => {
        clearError();
        setValue(e.target.value);
    }, [clearError]);

    const handleFocus = React.useCallback(() => {
        setEditEnabled(true);
        clearError();
    }, [clearError]);

    const handleCancel = React.useCallback(() => {
        updateInputValue();
        setEditEnabled(false);
    }, [updateInputValue]);


    return useMemo(() => ({
        editEnabled, setEditEnabled,
        value, setValue,
        error, setError, clearError,
        elementRef,
        submitButtonRef,
        handleChange,
        handleFocus,
        handleCancel
    }), [
        editEnabled, setEditEnabled,
        value, setValue,
        error, setError, clearError,
        elementRef,
        submitButtonRef,
        handleChange,
        handleFocus,
        handleCancel
    ]);
}
