import { AxiosError, isAxiosError } from "axios";
import { useCallback, useEffect, useRef } from "react";
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

/**
 * Adds a timeout to a handler callback. Cancels the timeout on component
 * unmount. Should not be used for long timeout which may overlap, as only the
 * last timeout is cancelled.
 *
 * @param handler The handler to be called after the timeout.
 * @param timeout The timeout in ms.
 * @returns The handler function wrapped in setTimeout.
 */
export const useTimeoutHandler = (
  handler: TimerHandler,
  timeout?: number | undefined,
) => {
  const timeoutIdRef = useRef<number>(-1);

  useEffect(
    () => () => {
      clearTimeout(timeoutIdRef.current);
    },
    [],
  );

  const returnHandler = () => {
    timeoutIdRef.current = setTimeout(handler, timeout);
  };

  return returnHandler;
};
