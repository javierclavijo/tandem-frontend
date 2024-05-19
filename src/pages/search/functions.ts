import qs from "qs";
import {
  languageKeys,
  languageOptions,
  levelKeys,
  levelOptions,
} from "../../common/constants";
import { Language, NonNativeProficiencyLevel } from "../../common/types";
import {
  BaseSearchParams,
  ChannelSearchParams,
  SearchPanelFormValues,
  UserSearchParams,
} from "./types";

const getLanguagesFromArray = (strings: string[]) =>
  strings.filter((param) => languageKeys.includes(param)) as Language[];

const getLevelsFromArray = (strings: string[]) =>
  strings.filter((param) =>
    levelKeys.includes(param),
  ) as NonNativeProficiencyLevel[];

export const getOptionsFromLanguages = (languages: Language[]) =>
  languages.map((key) => languageOptions[key as Language]);

export const getOptionsFromLevels = (levels: NonNativeProficiencyLevel[]) =>
  levels.map((key) => levelOptions[key as NonNativeProficiencyLevel]);

export const getBaseSearchParams = (
  searchParams: URLSearchParams,
): BaseSearchParams => {
  const type = searchParams.get("type") ?? "users";
  const search = searchParams.get("search") ?? "";

  return {
    type,
    search,
  };
};

export const getUserExclusiveSearchParams = (
  searchParams: URLSearchParams,
): Required<Omit<UserSearchParams, keyof BaseSearchParams>> => {
  const nativeLanguages: Language[] = getLanguagesFromArray(
    searchParams.getAll("nativeLanguages"),
  );
  const learningLanguages: Language[] = getLanguagesFromArray(
    searchParams.getAll("learningLanguages"),
  );
  const learningLanguageLevels: NonNativeProficiencyLevel[] =
    getLevelsFromArray(searchParams.getAll("learningLanguagesLevels"));

  return {
    nativeLanguages,
    learningLanguages,
    learningLanguageLevels,
  };
};

export const getChannelExclusiveSearchParams = (
  searchParams: URLSearchParams,
): Required<Omit<ChannelSearchParams, keyof BaseSearchParams>> => {
  const languages: Language[] = getLanguagesFromArray(
    searchParams.getAll("languages"),
  );
  const levels: NonNativeProficiencyLevel[] = getLevelsFromArray(
    searchParams.getAll("levels"),
  );

  return {
    languages,
    levels,
  };
};

export const getUserSearchParams = (
  searchParams: URLSearchParams,
): UserSearchParams => {
  return {
    ...getBaseSearchParams(searchParams),
    ...getUserExclusiveSearchParams(searchParams),
  };
};

export const getChannelSearchParams = (
  searchParams: URLSearchParams,
): ChannelSearchParams => {
  return {
    ...getBaseSearchParams(searchParams),
    ...getChannelExclusiveSearchParams(searchParams),
  };
};

const stringifyParams = (params: unknown): string =>
  qs.stringify(params, { arrayFormat: "repeat" });

/**
 * Sets the URL search params. These are later used by the parent component to
 * fetch data from the server.
 */
export const onSearchSubmit = (
  values: SearchPanelFormValues,
  onParamsSet: (params: string) => void,
) => {
  const {
    type,
    search,
    nativeLanguages,
    learningLanguages,
    learningLanguageLevels,
    channelLanguages,
    channelLevels,
  } = values;
  if (type.value === "users") {
    const params: UserSearchParams = {
      type: type.value,
      search,
      nativeLanguages: nativeLanguages?.map((language) => language.value),
      learningLanguages: learningLanguages?.map((language) => language.value),
      learningLanguageLevels: learningLanguageLevels?.map(
        (level) => level.value,
      ),
    };
    onParamsSet(stringifyParams(params));
  } else if (type.value === "channels") {
    const params: ChannelSearchParams = {
      type: type.value,
      search,
      languages: channelLanguages?.map((language) => language.value),
      levels: channelLevels?.map((level) => level.value),
    };
    onParamsSet(stringifyParams(params));
  }
};
