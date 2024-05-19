import { css } from "@emotion/react";
import { PropsWithChildren, forwardRef } from "react";
import { StyledEmotionComponentProps } from "../../types";

interface ThumbnailContainerProps
  extends PropsWithChildren<React.ClassAttributes<HTMLDivElement>>,
    React.ButtonHTMLAttributes<HTMLDivElement>,
    StyledEmotionComponentProps {}

const ThumbnailContainer = forwardRef<HTMLDivElement, ThumbnailContainerProps>(
  ({ children, ...props }: ThumbnailContainerProps, ref?) => (
    <div {...props} ref={ref} css={[div, props.css]}>
      {children}
    </div>
  ),
);

const div = css`
  height: 3rem;
  width: 3rem;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

ThumbnailContainer.displayName = "ThumbnailContainer";

export default ThumbnailContainer;
