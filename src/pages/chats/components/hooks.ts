import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

/**
 * Holds state and functionality to update a user or channel's name or description.
 */
// TODO: probably remove this altogether, substitute with RHF.
export function useEditField<
  T extends HTMLInputElement | HTMLTextAreaElement,
  S,
>(data: S | undefined, dataKey: keyof S): UseEditType<T> {
  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const elementRef = useRef<T>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const clearError = useCallback(() => {
    if (error) {
      setError("");
    }
  }, [error]);

  const updateInputValue = useCallback(() => {
    const dataValue = data?.[dataKey];
    if (dataValue && typeof dataValue === "string") {
      setValue(dataValue);
    }
  }, [data, dataKey]);

  // Set data on init and whenever data changes (i.e. after submitting)
  useEffect(updateInputValue, [data?.[dataKey], updateInputValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<T>) => {
      clearError();
      setValue(e.target.value);
    },
    [clearError],
  );

  const handleFocus = useCallback(() => {
    setEditEnabled(true);
    clearError();
  }, [clearError]);

  const handleCancel = useCallback(() => {
    updateInputValue();
    setEditEnabled(false);
  }, [updateInputValue]);

  return useMemo(
    () => ({
      editEnabled,
      setEditEnabled,
      value,
      setValue,
      error,
      setError,
      clearError,
      elementRef,
      submitButtonRef,
      handleChange,
      handleFocus,
      handleCancel,
    }),
    [
      editEnabled,
      setEditEnabled,
      value,
      setValue,
      error,
      setError,
      clearError,
      elementRef,
      submitButtonRef,
      handleChange,
      handleFocus,
      handleCancel,
    ],
  );
}
