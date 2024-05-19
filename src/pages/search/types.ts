import { UseInfiniteQueryOptions } from "react-query";
import { LabelOption } from "../../common/components/Select/types";
import { Language, NonNativeProficiencyLevel } from "../../common/types";
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
  type: LabelOption<ChatType>;
  search: string;

  // User search.
  nativeLanguages?: LabelOption<Language>[];
  learningLanguages?: LabelOption<Language>[];
  learningLanguageLevels?: LabelOption<NonNativeProficiencyLevel>[];

  // Channel search.
  channelLanguages?: LabelOption<Language>[];
  channelLevels?: LabelOption<NonNativeProficiencyLevel>[];
}
