import { css } from "@emotion/react";
import { memo } from "react";

type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

interface ProfileImageProps extends Omit<ImgProps, "src"> {
  src?: string | null;
}

function ProfileImage({ ...props }: ProfileImageProps) {
  return (
    <img
      {...props}
      src={props.src ?? "/images/user-placeholder.png"}
      css={img}
    />
  );
}

export const img = css`
  width: 12rem;
  height: 12rem;
  max-width: 12rem;
  border-radius: 50%;
  object-fit: cover;
`;

export default memo(ProfileImage);
