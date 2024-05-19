import { css } from "@emotion/react";
import { NavArrowRight } from "iconoir-react";
import { Link } from "react-router-dom";
import ResponsiveEllipsis from "../../../common/components/ResponsiveEllipsis";
import { COLORS } from "../../../common/constants";
import { linkContainer } from "../../../common/styles";

import Thumbnail from "../../../common/components/Thumbnail/Thumbnail";
import ThumbnailContainer from "../../../common/components/Thumbnail/ThumbnailContainer";

interface RecentElementProps {
  chatName: string;
  chatImage: string | null;
  lastMessageText: string;
  lastMessageAuthorName: string;
  isOwnMessage: boolean;
  link: string;
}

/**
 * Element component for post-login home 'recent' sections.
 */
const RecentElement = ({
  chatName,
  chatImage,
  lastMessageText,
  lastMessageAuthorName,
  isOwnMessage,
  link,
}: RecentElementProps) => {
  const displayedMessageContent = `${
    isOwnMessage ? "You" : lastMessageAuthorName
  }: ${lastMessageText}`;

  return (
    <article css={outerContainer}>
      <div css={innerContainer}>
        <ThumbnailContainer css={imgContainer}>
          <Thumbnail src={chatImage} />
        </ThumbnailContainer>
        <div css={contentContainer}>
          <div css={upperInnerContainer}>
            <h4>{chatName}</h4>
            <NavArrowRight
              color={COLORS.PRIMARY}
              width="1.5rem"
              height="1.5rem"
            />
          </div>
          <ResponsiveEllipsis
            text={displayedMessageContent}
            maxLine="2"
            ellipsis="…"
            trimRight
            basedOn="letters"
            css={content}
          />
        </div>
      </div>
      <Link to={link} css={linkCss} title={chatName} />
    </article>
  );
};

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
