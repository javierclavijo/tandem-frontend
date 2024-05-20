import { css } from "@emotion/react";
import ResponsiveEllipsis from "./ResponsiveEllipsis";
import Thumbnail from "./Thumbnail/Thumbnail";
import ThumbnailContainer from "./Thumbnail/ThumbnailContainer";

interface ChatMessageToastProps {
  chatImage?: string | null;
  authorName: string;
  messageContent: string;
}

const ChatMessageToast = ({
  chatImage,
  authorName,
  messageContent,
}: ChatMessageToastProps) => (
  <div css={container}>
    {chatImage != null && (
      <ThumbnailContainer>
        <Thumbnail src={chatImage} />
      </ThumbnailContainer>
    )}
    <div>
      <p css={authorNameCss}>{authorName}</p>
      <ResponsiveEllipsis
        text={messageContent}
        maxLine="2"
        ellipsis="…"
        trimRight
        basedOn="letters"
      />
    </div>
  </div>
);

const container = css`
  display: flex;
  gap: 1rem;
`;

const authorNameCss = css`
  font-weight: 600;
`;

export default ChatMessageToast;
