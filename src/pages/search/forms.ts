import { UseFormProps, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import {
  Language,
  NonNativeProficiencyLevel,
  Option,
  OptionsObject,
} from "../../common/types";
import { ChatType } from "../chats/types";
import {
  getBaseSearchParams,
  getChannelExclusiveSearchParams,
  getOptionsFromLanguages,
  getOptionsFromLevels,
  getUserExclusiveSearchParams,
} from "./functions";
import { SearchPanelFormValues } from "./types";

export const useSearchPanelForm = (
  options?: UseFormProps<SearchPanelFormValues>,
) => {
  const [searchParams] = useSearchParams();

  return useForm<SearchPanelFormValues>({
    defaultValues: getDefaultSearchPanelFormValues(searchParams),
    ...options,
  });
};

const getDefaultSearchPanelFormValues = (
  searchParams: URLSearchParams,
): SearchPanelFormValues => {
  const { type, search } = getBaseSearchParams(searchParams);

  if (type === "users") {
    const { nativeLanguages, learningLanguages, learningLanguageLevels } =
      getUserExclusiveSearchParams(searchParams);

    const nativeLanguageOptions = getOptionsFromLanguages(nativeLanguages);
    const learningLanguageOptions = getOptionsFromLanguages(learningLanguages);
    const learningLanguageLevelOptions: Option<NonNativeProficiencyLevel>[] =
      getOptionsFromLevels(learningLanguageLevels);

    return {
      type: searchTypeOptions[type],
      search,
      nativeLanguages: nativeLanguageOptions,
      learningLanguages: learningLanguageOptions,
      learningLanguageLevels: learningLanguageLevelOptions,
    };
  } else if (type === "channels") {
    const { languages, levels } = getChannelExclusiveSearchParams(searchParams);

    const channelLanguages: Option<Language>[] =
      getOptionsFromLanguages(languages);
    const channelLevels: Option<NonNativeProficiencyLevel>[] =
      getOptionsFromLevels(levels);

    return {
      type: searchTypeOptions[type],
      search,
      channelLanguages,
      channelLevels,
    };
  } else {
    throw new Error(
      "Query param 'type' must equal either 'users' or 'channels'.",
    );
  }
};

/**
 * Options for the search type select.
 */
const searchTypeOptions: OptionsObject<ChatType> = {
  users: { value: "users", label: "Users" },
  channels: { value: "channels", label: "Channels" },
};

export const searchTypeOptionsArray = [...Object.values(searchTypeOptions)];
