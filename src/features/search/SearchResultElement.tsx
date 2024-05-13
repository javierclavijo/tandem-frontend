/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import React from "react";
import { FlagIcon } from "react-flag-kit";
import { Link } from "react-router-dom";
import ResponsiveEllipsis from "../../components/ResponsiveEllipsis";
import { flagCodes } from "../../resources/languages";
import {
  containerWithLink,
  thumbnailContainer,
  thumbnailImg,
} from "../../styles/components";
import { colors } from "../../styles/variables";

import defaultImg from "../../static/images/user_placeholder.png";

interface SearchElementProps {
  id: string;
  name: string;
  languages: string[];
  description: string;
  image?: string | null;
  link: string;
}

/**
 * Element component for search results.
 */
function SearchResultElement(props: SearchElementProps) {
  return (
    <article css={outerContainer}>
      <div css={innerContainer}>
        <div css={imgContainer}>
          <img src={props.image ?? defaultImg} alt="" css={thumbnailImg} />
        </div>
        <div css={contentContainer}>
          <div css={upperInnerContainer}>
            <h4>{props.name}</h4>
            <NavArrowRight
              color={colors.PRIMARY}
              width={"1.5rem"}
              height={"1.5rem"}
            />
          </div>
          <div css={flagsContainer}>
            {props.languages.map((language) => (
              <FlagIcon
                code={flagCodes.find((x) => x.key === language)?.value || "AD"}
                size={24}
                key={`${props.id}-${language}`}
              />
            ))}
          </div>
          <ResponsiveEllipsis
            text={props.description}
            maxLine="1"
            ellipsis="…"
            trimRight
            basedOn="letters"
            css={description}
          />
        </div>
      </div>
      <Link to={props.link} css={link} title={props.name} />
    </article>
  );
}

const imgContainer = css`
  ${thumbnailContainer};
  height: 4.5rem;
  width: 4.5rem;
  flex: 0 0 auto;
`;

const outerContainer = css`
  ${containerWithLink};
  width: 100%;

  transition: background-color 0.1s;
  &:hover {
    background-color: ${colors.LIGHT};
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

const link = css`
  grid-area: element;
`;

const description = css`
  overflow-wrap: anywhere;
`;

export default SearchResultElement;
