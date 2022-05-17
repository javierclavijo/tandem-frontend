/** @jsxImportSource @emotion/react */

import React, { FormEvent } from "react";
import Select from "react-select";
import {
  languageOptions,
  levelOptions,
  Option,
} from "../../resources/languages";
import { noBorderAndBgSelectDark, searchSelect } from "../../styles/components";
import { css } from "@emotion/react";
import { Search } from "iconoir-react";
import { colors, textSizes } from "../../styles/variables";
import { buttonWithoutBackgroundAndBorder } from "../../components/Button";
import {
  ChannelSearchParams,
  searchTypeOptions,
  UserSearchParams,
} from "./Search";
import { useSearchParams } from "react-router-dom";
import qs from "qs";
import { DebounceInput } from "react-debounce-input";

interface SearchPanelProps {
  setUserSearchParams: React.Dispatch<React.SetStateAction<UserSearchParams>>;
  setChannelSearchParams: React.Dispatch<
    React.SetStateAction<ChannelSearchParams>
  >;
  searchType: Option;
  setSearchType: React.Dispatch<React.SetStateAction<Option>>;
}

/**
 * Holds the search form controls for search type and term, languages and levels. Fetches the URL search params on init and
 * sets them whenever the form is submitted. Conditionally renders search controls depending on the chosen search type
 * (users by default).
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
   */
  const [nativeLanguages, setNativeLanguages] = React.useState<Option[] | null>(
    null
  );
  const [learningLanguages, setLearningLanguages] = React.useState<
    Option[] | null
  >(null);
  const [learningLanguagesLevels, setLearningLanguagesLevels] = React.useState<
    Option[] | null
  >(null);

  /**
   * Channel search controls values.
   */
  const [channelLanguages, setChannelLanguages] = React.useState<
    Option[] | null
  >(null);
  const [channelLevels, setChannelLevels] = React.useState<Option[] | null>(
    null
  );

  /**
   * Controls whether the values have already been set according to the route's search params (i.e. if the hook below
   * has been executed)
   */
  const [areInitialValuesSet, setAreInitialValuesSet] =
    React.useState<boolean>(false);

  /**
   * Set the values to the route's search params on init. Select values must be found in the option arrays first.
   */
  React.useEffect(() => {
    if (!areInitialValuesSet) {
      const searchType = searchParams.get("type");
      setInputValue(searchParams.get("search") ?? "");

      if (searchType === searchTypeOptions.USERS.value) {
        setSearchType(searchTypeOptions.USERS);
        setNativeLanguages(
          languageOptions.filter((option) =>
            searchParams.getAll("nativeLanguages").includes(option.value)
          )
        );
        setLearningLanguages(
          languageOptions.filter((option) =>
            searchParams.getAll("learningLanguages").includes(option.value)
          )
        );
        const levels = levelOptions.filter((option) =>
          searchParams.getAll("learningLanguagesLevels").includes(option.value)
        );
        if (levels) {
          setLearningLanguagesLevels(levels);
        }
      } else if (searchType === searchTypeOptions.CHANNELS.value) {
        setSearchType(searchTypeOptions.CHANNELS);
        setChannelLanguages(
          languageOptions.filter((option) =>
            searchParams.getAll("languages").includes(option.value)
          )
        );
        setChannelLevels(
          levelOptions.filter((option) =>
            searchParams.getAll("levels").includes(option.value)
          )
        );
      }
      setAreInitialValuesSet(true);
    }
  }, [areInitialValuesSet, setSearchType, searchParams]);

  /**
   * Sets the corresponding URL search params, plus the query search params state itself.
   * @param [e]: The search form's submit event.
   */
  const handleSubmit = React.useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (searchType === searchTypeOptions.USERS) {
        const params: any = {
          type: searchTypeOptions.USERS.value,
          search: inputValue,
          nativeLanguages: nativeLanguages?.map((language) => language.value),
          learningLanguages: learningLanguages?.map(
            (language) => language.value
          ),
        };
        // Check that at least a learning language is selected before adding the level param.
        if (learningLanguages?.length) {
          params.learningLanguagesLevels = learningLanguagesLevels?.map(
            (level) => level.value
          );
        }
        setSearchParams(qs.stringify(params, { arrayFormat: "repeat" }));
        setUserSearchParams(params);
      } else {
        const params: any = {
          type: searchTypeOptions.CHANNELS.value,
          search: inputValue,
          languages: channelLanguages?.map((language) => language.value),
        };
        // Check that at least a learning language is selected before adding the level params.
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
    ]
  );

  /**
   * Submit the search whenever any select's values are updated, but only if the initial values from search params
   * have been set already.
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
    <form
      onSubmit={handleSubmit}
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          height: 3rem;
          width: 100%;
          padding: 0.25rem 0.5rem;
          box-sizing: border-box;
          border-radius: 3px;
          background-color: ${colors.LIGHT};
        `}
      >
        {/* Search input. */}
        <DebounceInput
          type="search"
          name="search-query"
          placeholder="Search..."
          minLength={2}
          debounceTimeout={300}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          css={css`
            background: none;
            outline: none;
            border: none;
            flex: 1 1 auto;
            min-width: 4rem;
            font-size: ${textSizes.M};
          `}
        />
        <div
          css={css`
            display: flex;
            align-items: center;
            flex: 0 0 auto;
          `}
        >
          {/* Search type select. Allows the user to toggle between user and channel search. */}
          <Select
            id={`search-type`}
            value={searchType}
            options={[searchTypeOptions.USERS, searchTypeOptions.CHANNELS]}
            onChange={(option: any) => setSearchType(option)}
            defaultValue={searchTypeOptions.USERS}
            placeholder="Type"
            styles={noBorderAndBgSelectDark}
          />

          {/* Submit button. */}
          <button
            type="submit"
            css={css`
              ${buttonWithoutBackgroundAndBorder};
              flex: 0 0 auto;
            `}
          >
            <Search color={colors.PRIMARY} width={"1.5rem"} height={"1.5rem"} />
          </button>
        </div>
      </div>
      <div
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;

          @media (min-width: 1024px) {
            flex-direction: row;
          }
        `}
      >
        {searchType === searchTypeOptions.USERS ? (
          /**
           * User search controls.
           */
          <React.Fragment>
            {/* User native languages multi-select.
                        Automatically disables options which are selected as learning languages. */}
            <Select
              id={`native-languages`}
              isMulti={true}
              value={nativeLanguages}
              options={languageOptions}
              onChange={(options: any) => setNativeLanguages(options)}
              isOptionDisabled={(option) =>
                !!learningLanguages?.includes(option as Option)
              }
              placeholder="Mother tongue(s)"
              styles={searchSelect}
            />

            {/* User learning languages multi-select.
                        Automatically disables options which are selected as native languages.
                        Is set to null if no option is selected, as the level select is not disabled if the language
                        state is set to an empty array. */}
            <Select
              id={`learning-languages`}
              isMulti={true}
              value={learningLanguages}
              options={languageOptions}
              onChange={(options: any) =>
                setLearningLanguages(options.length ? options : null)
              }
              isOptionDisabled={(option) =>
                !!nativeLanguages?.includes(option as Option)
              }
              placeholder="Is learning..."
              styles={searchSelect}
            />

            {/* User learning languages levels select. */}
            <Select
              id={`learning-languages-levels`}
              isMulti={true}
              value={learningLanguagesLevels}
              options={levelOptions}
              onChange={async (option: any) =>
                setLearningLanguagesLevels(option)
              }
              isDisabled={!learningLanguages || !learningLanguages.length}
              placeholder="Level(s)"
              styles={searchSelect}
            />
          </React.Fragment>
        ) : (
          /**
           * Channel search controls.
           */
          <React.Fragment>
            {/* Channel language multi-select.
                        Is set to null if no option is selected, as the level select is not disabled if the language
                        state is set to an empty array. */}
            <Select
              id={`channel-languages`}
              isMulti={true}
              value={channelLanguages}
              options={languageOptions}
              onChange={(options: any) =>
                setChannelLanguages(options.length ? options : null)
              }
              placeholder="Language(s)"
              styles={searchSelect}
            />

            {/* Channel level select. */}
            <Select
              id={`channel-levels`}
              isMulti={true}
              value={channelLevels}
              options={levelOptions}
              onChange={async (options: any) => setChannelLevels(options)}
              isDisabled={!channelLanguages || !channelLanguages.length}
              placeholder="Level(s)"
              styles={searchSelect}
            />
          </React.Fragment>
        )}
      </div>
    </form>
  );
}

export default SearchPanel;
