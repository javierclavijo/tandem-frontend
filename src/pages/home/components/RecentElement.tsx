import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import { Link } from "react-router-dom";
import ResponsiveEllipsis from "../../../common/components/ResponsiveEllipsis";
import { COLORS, LANGUAGE_INFO } from "../../../common/constants";
import { linkContainer } from "../../../common/styles";

import { FlagIcon } from "react-flag-kit";
import Thumbnail from "../../../common/components/Thumbnail/Thumbnail";
import ThumbnailContainer from "../../../common/components/Thumbnail/ThumbnailContainer";
import { Language } from "../../../common/types";

interface RecentElementProps {
  name: string;
  image: string | null;
  content: string;
  link: string;
  languages?: Language[];
  maxContentLines?: number;
}

const RecentElement = ({
  name,
  image,
  content,
  link,
  languages,
  maxContentLines = 1,
}: RecentElementProps) => (
  <article css={outerContainer}>
    <div css={innerContainer}>
      <ThumbnailContainer css={imgContainer}>
        <Thumbnail src={image} />
      </ThumbnailContainer>
      <div css={contentContainer}>
        <div css={upperInnerContainer}>
          <h4>{name}</h4>
          <NavArrowRight
            color={COLORS.PRIMARY}
            width="1.5rem"
            height="1.5rem"
          />
        </div>
        {languages != null && (
          <div css={flagsContainer}>
            {languages.map((language) => (
              <FlagIcon
                code={LANGUAGE_INFO[language].flagIconCode}
                size={24}
                key={language}
              />
            ))}
          </div>
        )}
        <ResponsiveEllipsis
          text={content}
          maxLine={maxContentLines}
          ellipsis="…"
          trimRight
          basedOn="letters"
          css={contentCss}
        />
      </div>
    </div>
    <Link to={link} css={linkCss} title={name} />
  </article>
);

const imgContainer = css`
  height: 4.5rem;
  width: 4.5rem;
  flex: 0 0 auto;
`;

const outerContainer = css`
  ${linkContainer};
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
  width: 100%;
`;

const contentCss = css`
  overflow-wrap: anywhere;
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

export default RecentElement;
