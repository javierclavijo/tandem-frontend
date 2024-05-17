import { AxiosError, isAxiosError } from "axios";
import { useCallback } from "react";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { ServerErrorResponse, UseFormSetErrorName } from "./types";

export const useSetFormErrorOnRequestError = <TData extends FieldValues>(
  setError: UseFormSetError<TData>,
) =>
  useCallback(
    (e: AxiosError<ServerErrorResponse>) => {
      if (isAxiosError(e) && e.response) {
        Object.entries(e.response.data as ServerErrorResponse).forEach(
          ([key, value]) =>
            value.forEach((valueError) =>
              setError(
                key as unknown as UseFormSetErrorName<TData>,
                {
                  type: "focus",
                  // Capitalize the message's first letter before setting it as
                  //the error message
                  message:
                    valueError[0].toUpperCase() + valueError.substring(1),
                },
                {
                  shouldFocus: true,
                },
              ),
            ),
        );
      }
    },
    [setError],
  );

export const useIsDesktop = () =>
  useMediaQuery({ query: "(min-width: 1024px)" });
