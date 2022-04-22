import React, {useMemo} from "react";

interface UseEditType<T> {
    editEnabled: boolean;
    setEditEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    elementRef: React.MutableRefObject<T | null>;
}

export function useEdit<T>(): UseEditType<T> {
    const [editEnabled, setEditEnabled] = React.useState<boolean>(false);
    const [inputValue, setInputValue] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const elementRef = React.useRef<T>(null);

    return useMemo(() => ({
        editEnabled, setEditEnabled,
        inputValue, setInputValue,
        error, setError,
        elementRef
    }), [
        editEnabled, setEditEnabled,
        inputValue, setInputValue,
        error, setError,
        elementRef
    ]);
}
