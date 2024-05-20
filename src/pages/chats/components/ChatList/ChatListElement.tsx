import { css } from "@emotion/react";
import { DateTime } from "luxon";
import { NavLink } from "react-router-dom";
import ResponsiveEllipsis from "../../../../common/components/ResponsiveEllipsis";
import Thumbnail from "../../../../common/components/Thumbnail/Thumbnail";
import ThumbnailContainer from "../../../../common/components/Thumbnail/ThumbnailContainer";
import { COLORS, FONT_SIZES } from "../../../../common/constants";
import { elementContentContainer, link } from "../../styles";

interface ChatListElementProps {
  chatId: string;
  chatName: string;
  chatImage: string | null;
  content: string;
  lastMessageDateTime: string;
  selected: boolean;
}

/**
 * Chat list element component. Renders with a different background color based
 * on whether the element's chat is currently being displayed, or the user is
 * hovering the mouse above the element.
 */
const ChatListElement = ({
  chatId,
  chatName,
  chatImage,
  content,
  lastMessageDateTime,
  selected,
}: ChatListElementProps) => {
  const formattedLastMessageDateTime = DateTime.fromISO(
    lastMessageDateTime,
  ).toLocaleString(DateTime.DATE_SHORT);

  return (
    <li css={[outerContainer, selected ? selectedOuterContainer : undefined]}>
      <div css={elementContentContainer}>
        <ThumbnailContainer>
          <Thumbnail src={chatImage} />
        </ThumbnailContainer>
        <div css={innerContainer}>
          <span css={title}>
            <span>{chatName}</span>
            <span css={lastMessageDatetimeCss}>
              {formattedLastMessageDateTime}
            </span>
          </span>

          <ResponsiveEllipsis
            text={content}
            maxLine="1"
            ellipsis="…"
            trimRight
            basedOn="letters"
            css={contentCss}
          />
        </div>
      </div>
      <NavLink to={`/chats/${chatId}`} css={link} title={chatName} />
    </li>
  );
};

const outerContainer = css`
  display: grid;
  border-bottom: 1px solid ${COLORS.LIGHT};
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  transition: background-color 0.1s;
  color: ${COLORS.DARK};
  background-color: ${COLORS.WHITE};

  &:hover {
    background-color: ${COLORS.LIGHT};
  }
`;

const selectedOuterContainer = css`
  color: ${COLORS.WHITE};
  background-color: ${COLORS.PRIMARY};

  &:hover {
    background-color: ${COLORS.PRIMARY};
  }
`;

const innerContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const title = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const lastMessageDatetimeCss = css`
  font-size: ${FONT_SIZES.S};
`;

const contentCss = css`
  overflow-wrap: anywhere;
`;

export default ChatListElement;
