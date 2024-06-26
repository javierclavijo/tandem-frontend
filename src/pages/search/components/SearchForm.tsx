import { css } from "@emotion/react";
import { Search } from "iconoir-react";
import { useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { Controller } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { StylesConfig } from "react-select";
import BaseSelect from "../../../common/components/Select/BaseSelect";
import DropdownSelect from "../../../common/components/Select/DropdownSelect";
import { LabelOption } from "../../../common/components/Select/types";
import {
  COLORS,
  languageOptionsArray,
  levelOptionsArray,
} from "../../../common/constants";
import { searchInput, searchInputElement } from "../../../common/styles";
import { Language, NonNativeProficiencyLevel } from "../../../common/types";
import { ChatType } from "../../chats/types";
import { searchTypeOptionsArray, useSearchPanelForm } from "../forms";
import { onSearchSubmit } from "../functions";

/**
 * Holds the search form controls for search type and term, languages and
 * levels. Fetches the URL search params on init and sets them whenever the form
 * is submitted. Conditionally renders search controls depending on the chosen
 * search type (users by default).
 */
const SearchForm = () => {
  const [, setSearchParams] = useSearchParams();
  const { watch, handleSubmit, control } = useSearchPanelForm();

  const { type, nativeLanguages, learningLanguages, channelLanguages } =
    watch();

  /**
   * Submit the search whenever any select's values are updated.
   *
   * See: https://stackoverflow.com/a/70119332
   */
  useEffect(() => {
    const subscription = watch(() =>
      handleSubmit((data) => onSearchSubmit(data, setSearchParams))(),
    );
    return () => subscription.unsubscribe();
  }, [handleSubmit, setSearchParams, watch]);

  return (
    <form css={form}>
      <div css={searchContainer}>
        {/* Search input. */}
        <Controller
          control={control}
          name="search"
          rules={{ min: 3, max: 64 }}
          render={({ field }) => (
            <DebounceInput
              {...field}
              type="search"
              placeholder="Search..."
              aria-label="Search users or channels by name or description"
              debounceTimeout={250}
              css={searchInputElement}
            />
          )}
        />
        <div css={searchTypeSelectContainer}>
          {/* Search type select. Allows the user to toggle between user and 
          channel search. */}
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <DropdownSelect<LabelOption<ChatType>>
                {...field}
                options={searchTypeOptionsArray}
                placeholder="Type"
                styles={
                  noBorderAndBgSelectDark as StylesConfig<LabelOption<ChatType>>
                }
              />
            )}
          />

          {/* Submit button. */}
          <Search
            color={COLORS.PRIMARY}
            width="1.5rem"
            height="1.5rem"
            css={submitButton}
          />
        </div>
      </div>
      <div css={filterSelectsContainer}>
        {type?.value === "channels" ? (
          <>
            {/* Channel search controls. */}
            <Controller
              control={control}
              name="channelLanguages"
              render={({ field }) => (
                <BaseSelect<LabelOption<Language>, true>
                  {...field}
                  isMulti
                  options={languageOptionsArray}
                  placeholder="Language(s)"
                  aria-label="Channel languages"
                  styles={
                    fullWidthSelect as StylesConfig<LabelOption<Language>>
                  }
                />
              )}
            />

            {/* Channel level select. */}
            <Controller
              control={control}
              name="channelLevels"
              render={({ field }) => (
                <BaseSelect<LabelOption<NonNativeProficiencyLevel>, true>
                  {...field}
                  isMulti
                  options={levelOptionsArray}
                  isDisabled={
                    channelLanguages == null || channelLanguages.length === 0
                  }
                  placeholder="Level(s)"
                  aria-label="Proficiency levels of channel languages"
                  styles={
                    fullWidthSelect as StylesConfig<
                      LabelOption<NonNativeProficiencyLevel>
                    >
                  }
                />
              )}
            />
          </>
        ) : (
          <>
            {/* User search controls. */}
            {/* User native languages multi-select.
                Automatically disables options which are selected as learning 
                languages. */}
            <Controller
              control={control}
              name="nativeLanguages"
              render={({ field }) => (
                <BaseSelect<LabelOption<Language>, true>
                  {...field}
                  isMulti
                  options={languageOptionsArray}
                  isOptionDisabled={(option) =>
                    !!learningLanguages?.includes(option)
                  }
                  placeholder="Native language(s)"
                  aria-label="Users' native languages"
                  styles={
                    fullWidthSelect as StylesConfig<LabelOption<Language>>
                  }
                />
              )}
            />

            {/* User learning languages multi-select. Automatically disables 
                options which are selected as native languages. */}
            <Controller
              control={control}
              name="learningLanguages"
              render={({ field }) => (
                <BaseSelect<LabelOption<Language>, true>
                  {...field}
                  isMulti
                  options={languageOptionsArray}
                  isOptionDisabled={(option) =>
                    !!nativeLanguages?.includes(option)
                  }
                  placeholder="Is learning..."
                  aria-label="Users' target languages"
                  styles={
                    fullWidthSelect as StylesConfig<LabelOption<Language>>
                  }
                />
              )}
            />

            {/* User learning language levels select. */}
            <Controller
              control={control}
              name="learningLanguageLevels"
              render={({ field }) => (
                <BaseSelect<LabelOption<NonNativeProficiencyLevel>, true>
                  {...field}
                  isMulti
                  options={levelOptionsArray}
                  isDisabled={
                    learningLanguages == null || learningLanguages.length === 0
                  }
                  placeholder="Level(s)"
                  aria-label="Proficiency levels of users' target languages"
                  styles={
                    fullWidthSelect as StylesConfig<
                      LabelOption<NonNativeProficiencyLevel>
                    >
                  }
                />
              )}
            />
          </>
        )}
      </div>
    </form>
  );
};

const form = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const searchContainer = css`
  ${searchInput};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  height: 3rem;
  width: 100%;
  padding: 0.25rem 0.5rem;
  box-sizing: border-box;
`;

const searchTypeSelectContainer = css`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const submitButton = css`
  flex: 0 0 auto;
`;

const filterSelectsContainer = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const noBorderAndBgSelectDark: StylesConfig = {
  dropdownIndicator: (provided) => ({
    ...provided,
    color: COLORS.DARK,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: COLORS.DARK,
  }),
  container: (provided) => ({
    ...provided,
    flex: "1 0 auto",
  }),
};

const fullWidthSelect: StylesConfig = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
};

export default SearchForm;
