import { useForm } from "react-hook-form";
import { SetPasswordFormValues } from "./types";

export const useSetPasswordForm = () => useForm<SetPasswordFormValues>();
