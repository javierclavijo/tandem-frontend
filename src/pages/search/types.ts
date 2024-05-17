import { UseInfiniteQueryOptions } from "react-query";
import { Language, ProficiencyLevel } from "../../common/types";

export interface SearchResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  nextPageNumber: number | null;
  previousPageNumber: number | null;
}

interface BaseSearchParams {
  type: string;
  search?: string;
}

export interface UserSearchParams extends BaseSearchParams {
  nativeLanguages?: Language[] | null;
  learningLanguages?: Language[] | null;
  learningLanguagesLevels?: ProficiencyLevel[] | null;
}

export interface ChannelSearchParams extends BaseSearchParams {
  languages?: string[] | null;
  levels?: string[] | null;
}

export type InfiniteQueryOptions<TData> = Omit<
  UseInfiniteQueryOptions<SearchResponse<TData>, unknown>,
  "queryKey" | "queryFn"
>;
