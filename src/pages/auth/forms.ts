import { useMemo } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import useAuth from "./AuthContext/AuthContext";
import { LogInRequestData } from "./AuthContext/types";
import { RegisterFormValues } from "./types";

const useLogInFormErrors = (
  error: string | undefined,
): FieldErrors<LogInRequestData> =>
  useMemo(() => ({ password: { type: "server", message: error } }), [error]);

export const useLogInForm = () => {
  const { error } = useAuth();
  const formErrors = useLogInFormErrors(error);

  return useForm<LogInRequestData>({
    // Set errors automatically based on auth context errors.
    errors: formErrors,
  });
};
export const useRegisterForm = () => useForm<RegisterFormValues>();
