import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import { Link } from "react-router-dom";
import { COLORS } from "../../../common/resources/style-variables";
import ResponsiveEllipsis from "../../../components/ResponsiveEllipsis";
import {
  containerWithLink,
  thumbnailContainer,
} from "../../../components/styles";

import ChatThumbnail from "../../../components/UserThumbnail";

interface SearchElementProps {
  id: string;
  name: string;
  latestMessage: string;
  image?: string | null;
  link: string;
}

/**
 * Element component for post-login home 'recent' sections.
 */
function RecentElement(props: SearchElementProps) {
  return (
    <article css={outerContainer}>
      <div css={innerContainer}>
        <div css={imgContainer}>
          <ChatThumbnail src={props.image} />
        </div>
        <div css={contentContainer}>
          <div css={upperInnerContainer}>
            <h4>{props.name}</h4>
            <NavArrowRight
              color={COLORS.PRIMARY}
              width={"1.5rem"}
              height={"1.5rem"}
            />
          </div>
          <ResponsiveEllipsis
            text={props.latestMessage}
            maxLine="2"
            ellipsis="…"
            trimRight
            basedOn="letters"
            css={content}
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

const link = css`
  grid-area: element;
`;

export default RecentElement;
