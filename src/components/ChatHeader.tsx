import { css } from "@emotion/react";
import { Link, To } from "react-router-dom";
import { animated } from "react-spring";
import { chatHeader } from "../features/chats/room/styles";
import { useFadeIn } from "../features/common/transitions";
import { containerWithLink, thumbnailContainer, thumbnailImg } from "./styles";
import BackButton from "./BackButton";

import defaultImg from "../static/images/user_placeholder.png";

export interface ChatHeaderProps {
  title?: string;
  link?: To;
  image?: string | null;
  actions?: JSX.Element;
}

/**
 * Chat header component. Can render a title, an image and action buttons.
 * If the 'link' prop is passed, it renders the link above the component's area.
 */
function ChatHeader(props: ChatHeaderProps) {
  const transitionProps = useFadeIn();

  return (
    <animated.header css={chatHeader} style={transitionProps}>
      <div css={backButtonContainer}>
        <BackButton />
        <div css={containerWithLink}>
          <div css={innerContainer}>
            {props.image || props.image === null ? (
              <div css={imageContainer}>
                <img
                  src={props.image ?? defaultImg}
                  alt=""
                  css={thumbnailImg}
                />
              </div>
            ) : null}
            <h2>{props.title}</h2>
          </div>
          {props.link ? (
            <Link to={props.link} css={link} title={props.title} />
          ) : null}
        </div>
      </div>
      {props.actions}
    </animated.header>
  );
}

const imageContainer = css`
  ${thumbnailContainer};
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

const link = css`
  grid-area: element;
  z-index: 10;
  width: auto;
  height: auto;
`;

export default ChatHeader;
