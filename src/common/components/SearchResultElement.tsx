import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import { FlagIcon } from "react-flag-kit";
import { Link } from "react-router-dom";
import { COLORS } from "../constants";
import ResponsiveEllipsis from "./ResponsiveEllipsis";
import { containerWithLink, thumbnailContainer } from "./styles";

import { LANGUAGE_INFO } from "../constants";
import { Language } from "../types";
import ChatThumbnail from "./UserThumbnail";

interface SearchResultElementProps {
  id: string;
  name: string;
  languages: Language[];
  description: string;
  image?: string | null;
  link: string;
}

/**
 * Element component for search results.
 */
const SearchResultElement = ({
  id,
  name,
  languages,
  description,
  image,
  link,
}: SearchResultElementProps) => {
  return (
    <article css={[containerWithLink, outerContainer]}>
      <div css={innerContainer}>
        <div css={[thumbnailContainer, imgContainer]}>
          <ChatThumbnail src={image} />
        </div>
        <div css={contentContainer}>
          <div css={upperInnerContainer}>
            <h4>{name}</h4>
            <NavArrowRight
              color={COLORS.PRIMARY}
              width="1.5rem"
              height="1.5rem"
            />
          </div>
          <div css={flagsContainer}>
            {languages.map((language) => (
              <FlagIcon
                code={LANGUAGE_INFO[language].flagIconCode}
                size={24}
                key={`${id}-${language}`}
              />
            ))}
          </div>
          <ResponsiveEllipsis
            text={description}
            maxLine="1"
            ellipsis="…"
            trimRight
            basedOn="letters"
            css={descriptionCss}
          />
        </div>
      </div>
      <Link to={link} css={linkCss} title={name} />
    </article>
  );
};

const imgContainer = css`
  height: 4.5rem;
  width: 4.5rem;
  flex: 0 0 auto;
`;

const outerContainer = css`
  width: 100%;

  transition: background-color 0.1s;
  &:hover {
    background-color: ${COLORS.LIGHT};
  }
`;

const innerContainer = css`
  grid-area: element;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 0.5rem;
  box-sizing: border-box;
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const upperInnerContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const flagsContainer = css`
  display: flex;
  gap: 0.5rem;
`;

const linkCss = css`
  grid-area: element;
`;

const descriptionCss = css`
  overflow-wrap: anywhere;
`;

export default SearchResultElement;
