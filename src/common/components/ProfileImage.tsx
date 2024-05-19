import { css } from "@emotion/react";
import { memo } from "react";
import userPlaceholderImage from "../../common/static/images/user-placeholder.png";
import { ImgProps, StyledEmotionComponentProps } from "../types";

interface ProfileImageProps
  extends Omit<ImgProps, "src">,
    StyledEmotionComponentProps {
  src?: string | null;
}

const ProfileImage = ({ css, ...props }: ProfileImageProps) => {
  return (
    <img {...props} src={props.src ?? userPlaceholderImage} css={[img, css]} />
  );
};

export const img = css`
  width: 12rem;
  height: 12rem;
  max-width: 12rem;
  border-radius: 50%;
  object-fit: cover;
`;

export default memo(ProfileImage);
