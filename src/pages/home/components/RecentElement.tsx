import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import { Link } from "react-router-dom";
import ResponsiveEllipsis from "../../../common/components/ResponsiveEllipsis";
import {
  containerWithLink,
  thumbnailContainer,
} from "../../../common/components/styles";
import { COLORS } from "../../../common/constants";

import ChatThumbnail from "../../../common/components/UserThumbnail";

interface RecentElementProps {
  id: string;
  name: string;
  latestMessage: string;
  image?: string | null;
  link: string;
}

// TODO: refactor this and SearchResultElement into a single UserCard component.
/**
 * Element component for post-login home 'recent' sections.
 */
function RecentElement({
  id,
  name,
  latestMessage,
  image,
  link,
}: RecentElementProps) {
  return (
    <article css={outerContainer}>
      <div css={innerContainer}>
        <div css={imgContainer}>
          <ChatThumbnail src={image} />
        </div>
        <div css={contentContainer}>
          <div css={upperInnerContainer}>
            <h4>{name}</h4>
            <NavArrowRight
              color={COLORS.PRIMARY}
              width={"1.5rem"}
              height={"1.5rem"}
            />
          </div>
          <ResponsiveEllipsis
            text={latestMessage}
            maxLine="2"
            ellipsis="…"
            trimRight
            basedOn="letters"
            css={content}
          />
        </div>
      </div>
      <Link to={link} css={linkCss} title={name} />
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

const content = css`
  overflow-wrap: anywhere;
`;

const upperInnerContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const linkCss = css`
  grid-area: element;
`;

export default RecentElement;
