import { SessionInfoResponse } from "./types";

export const getSessionInfoFromQueryData = (
  sessionInfo: SessionInfoResponse | undefined,
): SessionInfoResponse =>
  sessionInfo != null ? sessionInfo : { id: null, url: null };
