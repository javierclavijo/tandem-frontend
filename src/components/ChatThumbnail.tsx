import { css } from "@emotion/react";
import { memo } from "react";

type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

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
