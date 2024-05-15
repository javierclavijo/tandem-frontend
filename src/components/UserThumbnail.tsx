import { css } from "@emotion/react";
import { memo } from "react";
import { ImgProps } from "../common/types";

interface UserThumbnailProps extends Omit<ImgProps, "src"> {
  src?: string | null;
}

function UserThumbnail({ ...props }: UserThumbnailProps) {
  return (
    <img
      {...props}
      src={props.src ?? "/images/user-placeholder.png"}
      css={img}
    />
  );
}

export const img = css`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export default memo(UserThumbnail);
