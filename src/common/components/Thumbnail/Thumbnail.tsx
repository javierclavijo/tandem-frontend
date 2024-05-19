import { css } from "@emotion/react";
import { memo } from "react";
import userPlaceholderImage from "../../../common/static/images/user-placeholder.png";
import { ImgProps } from "../../types";

interface ThumbnailProps extends Omit<ImgProps, "src"> {
  src?: string | null;
}

const Thumbnail = ({ ...props }: ThumbnailProps) => (
  <img {...props} src={props.src ?? userPlaceholderImage} css={img} />
);

export const img = css`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export default memo(Thumbnail);
