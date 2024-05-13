/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Search } from "iconoir-react";
import qs from "qs";
import React, { FormEvent } from "react";
import { DebounceInput } from "react-debounce-input";
import { useSearchParams } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { languageOptions, levelOptions } from "../../resources/languages";
import {
  buttonWithoutBackgroundAndBorder,
  noBorderAndBgSelectDark,
  searchInput,
  searchInputElement,
  searchSelect,
} from "../../styles/components";
import { colors } from "../../styles/variables";
import { Language, Option, ProficiencyLevel } from "../common/types";
import {
  ChannelSearchParams,
  UserSearchParams,
  searchTypeOptions,
} from "./Search";

interface SearchPanelProps {
  setUserSearchParams: React.Dispatch<
    React.SetStateAction<UserSearchParams | null>
  >;
  setChannelSearchParams: React.Dispatch<
    React.SetStateAction<ChannelSearchParams | null>
  >;
  searchType: Option | null;
  setSearchType: React.Dispatch<React.SetStateAction<Option | null>>;
}

/**
 * Holds the search form controls for search type and term, languages and
 * levels. Fetches the URL search params on init and sets them whenever the form
 * is submitted. Conditionally renders search controls depending on the chosen
 * search type (users by default).
 */
function SearchPanel({
  setUserSearchParams,
  setChannelSearchParams,
  searchType,
  setSearchType,
}: SearchPanelProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Search query input value.
   */
  const [inputValue, setInputValue] = React.useState<string>("");

  /**
   * User search controls values.
   * learningLanguages can be null, as the level select depends on it -- it's
   * only disabled if channelLanguages is null, but is enabled if it's an empty
   * array.
   */
  const [nativeLanguages, setNativeLanguages] = React.useState<
    Option<Language>[]
  >([]);
  const [learningLanguages, setLearningLanguages] = React.useState<
    Option<Language>[] | null
  >(null);
  const [learningLanguagesLevels, setLearningLanguagesLevels] = React.useState<
    Option<ProficiencyLevel>[]
  >([]);

  /**
   * Channel search controls values.
   * channelLanguages follows the same logic as learningLanguages with regard
   * to being null.
   */
  const [channelLanguages, setChannelLanguages] = React.useState<
    Option[] | null
  >(null);
  const [channelLevels, setChannelLevels] = React.useState<Option[]>([]);

  /**
   * Controls whether the values have already been set according to the route's
   * search params (i.e. if the hook below has been executed)
   */
  const [areInitialValuesSet, setAreInitialValuesSet] =
    React.useState<boolean>(false);

  /**
   * Set the values to the route's search params on init. Select values must be
   * found in the option arrays first.
   */
  React.useEffect(() => {
    if (!areInitialValuesSet) {
      const searchType = searchParams.get("type");
      setInputValue(searchParams.get("search") ?? "");

      if (searchType === searchTypeOptions.USERS.value) {
        setSearchType(searchTypeOptions.USERS);
        setNativeLanguages(
          languageOptions.filter((option) =>
            searchParams.getAll("nativeLanguages").includes(option.value),
          ),
        );
        setLearningLanguages(
          languageOptions.filter((option) =>
            searchParams.getAll("learningLanguages").includes(option.value),
          ),
        );
        const levels = levelOptions.filter((option) =>
          searchParams.getAll("learningLanguagesLevels").includes(option.value),
        );
        if (levels) {
          setLearningLanguagesLevels(levels);
        }
      } else if (searchType === searchTypeOptions.CHANNELS.value) {
        setSearchType(searchTypeOptions.CHANNELS);
        setChannelLanguages(
          languageOptions.filter((option) =>
            searchParams.getAll("languages").includes(option.value),
          ),
        );
        setChannelLevels(
          levelOptions.filter((option) =>
            searchParams.getAll("levels").includes(option.value),
          ),
        );
      }
      setAreInitialValuesSet(true);
    }
  }, [areInitialValuesSet, setSearchType, searchParams]);

  /**
   * Sets the corresponding URL search params, plus the query search params
   * state itself.
   * @param [e]: The search form's submit event.
   */
  const handleSubmit = React.useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (searchType === searchTypeOptions.USERS) {
        const params: UserSearchParams = {
          type: searchTypeOptions.USERS.value,
          search: inputValue,
          nativeLanguages: nativeLanguages?.map((language) => language.value),
          learningLanguages: learningLanguages?.map(
            (language) => language.value,
          ),
        };
        // Check that at least a learning language is selected before adding the
        // level param.
        if (learningLanguages?.length) {
          params.learningLanguagesLevels = learningLanguagesLevels?.map(
            (level) => level.value,
          );
        }
        setSearchParams(qs.stringify(params, { arrayFormat: "repeat" }));
        setUserSearchParams(params);
      } else {
        const params: ChannelSearchParams = {
          type: searchTypeOptions.CHANNELS.value,
          search: inputValue,
          languages: channelLanguages?.map((language) => language.value),
        };
        // Check that at least a learning language is selected before adding the
        // level params.
        if (channelLevels?.length) {
          params.levels = channelLevels.map((level) => level.value);
        }
        setSearchParams(qs.stringify(params, { arrayFormat: "repeat" }));
        setChannelSearchParams(params);
      }
    },
    [
      channelLanguages,
      channelLevels,
      inputValue,
      learningLanguages,
      learningLanguagesLevels,
      nativeLanguages,
      searchType,
      setUserSearchParams,
      setChannelSearchParams,
      setSearchParams,
    ],
  );

  /**
   * Submit the search whenever any select's values are updated, but only if the
   * initial values from search params have been set already.
   */
  React.useEffect(() => {
    if (areInitialValuesSet) handleSubmit();
  }, [
    nativeLanguages,
    learningLanguages,
    learningLanguagesLevels,
    channelLanguages,
    channelLevels,
    areInitialValuesSet,
    searchType,
    handleSubmit,
  ]);

  return (
    <form onSubmit={handleSubmit} css={form}>
      <div css={searchContainer}>
        {/* Search input. */}
        <DebounceInput
          type="search"
          name="search-query"
          placeholder="Search..."
          aria-label="Search users or channels by name or description"
          minLength={2}
          debounceTimeout={300}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          css={searchInputElement}
        />
        <div css={searchTypeSelectContainer}>
          {/* Search type select. Allows the user to toggle between user and 
          channel search. */}
          <Select<Option>
            id={`search-type`}
            value={searchType}
            options={[searchTypeOptions.USERS, searchTypeOptions.CHANNELS]}
            onChange={setSearchType}
            defaultValue={searchTypeOptions.USERS}
            placeholder="Type"
            // TODO: create generic styled select components
            styles={noBorderAndBgSelectDark as StylesConfig<Option>}
            aria-label="Search type"
          />

          {/* Submit button. */}
          <button
            type="submit"
            aria-label="Submit search filters"
            css={submitButton}
          >
            <Search color={colors.PRIMARY} width={"1.5rem"} height={"1.5rem"} />
          </button>
        </div>
      </div>
      <div css={filterSelectsContainer}>
        {searchType === searchTypeOptions.USERS ? (
          /**
           * User search controls.
           */
          <React.Fragment>
            {/* User native languages multi-select.
            Automatically disables options which are selected as learning 
            languages. */}
            <Select<Option<Language>, true>
              id={`native-languages`}
              isMulti={true}
              value={nativeLanguages}
              options={languageOptions}
              onChange={(options) => setNativeLanguages([...options])}
              isOptionDisabled={(option) =>
                !!learningLanguages?.includes(option as Option<Language>)
              }
              placeholder="Mother tongue(s)"
              aria-label="Users' mother tongues"
              styles={searchSelect as StylesConfig<Option<Language>, true>}
            />

            {/* User learning languages multi-select. Automatically disables 
            options which are selected as native languages. */}
            <Select<Option<Language>, true>
              id={`learning-languages`}
              isMulti={true}
              value={learningLanguages}
              options={languageOptions}
              onChange={(options) =>
                setLearningLanguages(options?.length ? [...options] : null)
              }
              isOptionDisabled={(option) =>
                !!nativeLanguages?.includes(option as Option<Language>)
              }
              placeholder="Is learning..."
              aria-label="Users' target languages"
              styles={searchSelect as StylesConfig<Option<Language>, true>}
            />

            {/* User learning languages levels select. */}
            <Select<Option<ProficiencyLevel>, true>
              id={`learning-languages-levels`}
              isMulti={true}
              value={learningLanguagesLevels}
              options={levelOptions}
              onChange={(options) => setLearningLanguagesLevels([...options])}
              isDisabled={!learningLanguages || !learningLanguages.length}
              placeholder="Level(s)"
              aria-label="Proficiency levels of users' target languages"
              styles={
                searchSelect as StylesConfig<Option<ProficiencyLevel>, true>
              }
            />
          </React.Fragment>
        ) : (
          /**
           * Channel search controls.
           */
          <React.Fragment>
            {/* Channel language multi-select. Is set to null if no option is 
            selected, as the level select is not disabled if the language state 
            is set to an empty array. */}
            <Select<Option, true>
              id={`channel-languages`}
              isMulti={true}
              value={channelLanguages}
              options={languageOptions}
              onChange={(options) =>
                setChannelLanguages(options.length ? [...options] : null)
              }
              placeholder="Language(s)"
              aria-label="Channel languages"
              styles={searchSelect as StylesConfig<Option, true>}
            />

            {/* Channel level select. */}
            <Select<Option, true>
              id={`channel-levels`}
              isMulti={true}
              value={channelLevels}
              options={levelOptions}
              onChange={(options) => setChannelLevels([...options])}
              isDisabled={!channelLanguages || !channelLanguages.length}
              placeholder="Level(s)"
              aria-label="Proficiency levels of channel languages"
              styles={searchSelect as StylesConfig<Option, true>}
            />
          </React.Fragment>
        )}
      </div>
    </form>
  );
}

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
  ${buttonWithoutBackgroundAndBorder};
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

export default SearchPanel;
