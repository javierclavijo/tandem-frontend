import { UseInfiniteQueryOptions } from "react-query";
import {
  Language,
  NonNativeProficiencyLevel,
  Option,
} from "../../common/types";
import { ChatType } from "../chats/types";

export interface SearchResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  nextPageNumber: number | null;
  previousPageNumber: number | null;
}

export interface BaseSearchParams {
  type: string;
  search: string;
}

export interface UserSearchParams extends BaseSearchParams {
  nativeLanguages?: Language[];
  learningLanguages?: Language[];
  learningLanguageLevels?: NonNativeProficiencyLevel[];
}

export interface ChannelSearchParams extends BaseSearchParams {
  languages?: Language[];
  levels?: NonNativeProficiencyLevel[];
}

export type InfiniteQueryOptions<TData> = Omit<
  UseInfiniteQueryOptions<SearchResponse<TData>, unknown>,
  "queryKey" | "queryFn"
>;

export interface SearchPanelFormValues {
  type: Option<ChatType>;
  search: string;

  // User search.
  nativeLanguages?: Option<Language>[];
  learningLanguages?: Option<Language>[];
  learningLanguageLevels?: Option<NonNativeProficiencyLevel>[];

  // Channel search.
  channelLanguages?: Option<Language>[];
  channelLevels?: Option<NonNativeProficiencyLevel>[];
}
