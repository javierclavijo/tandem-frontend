import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { animated } from "react-spring";
import BackButton from "../../../common/components/BackButton";
import Thumbnail from "../../../common/components/Thumbnail/Thumbnail";
import ThumbnailContainer from "../../../common/components/Thumbnail/ThumbnailContainer";
import { linkContainer } from "../../../common/styles";
import { useFadeIn } from "../../../common/transitions";
import { chatHeader } from "../chat/styles";
import { ChatHeaderData } from "../types";

interface ChatHeaderProps extends ChatHeaderData {}

/**
 * Chat header component. Can render a title, an image and action buttons.
 * If the 'link' prop is passed, it renders the link above the component's area.
 */
const ChatHeader = ({ title, link, image, actions }: ChatHeaderProps) => {
  const transitionProps = useFadeIn();

  return (
    <animated.header css={chatHeader} style={transitionProps}>
      <div css={backButtonContainer}>
        <BackButton />
        <div css={linkContainer}>
          <div css={innerContainer}>
            {image != null && (
              <ThumbnailContainer css={imageContainer}>
                <Thumbnail src={image} />
              </ThumbnailContainer>
            )}
            <h2>{title}</h2>
          </div>
          {link != null && <Link to={link} css={linkCss} title={title} />}
        </div>
      </div>
      {actions}
    </animated.header>
  );
};

const imageContainer = css`
  flex: 0 0 auto;
`;

const backButtonContainer = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const innerContainer = css`
  grid-area: element;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const linkCss = css`
  grid-area: element;
  z-index: 10;
  width: auto;
  height: auto;
`;

export default ChatHeader;
