import { css } from "@emotion/react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { infoButton } from "../../../pages/chats/styles";
import { COLORS, FONT_SIZES } from "../../constants";
import ChatThumbnail from "../UserThumbnail";
import { thumbnailContainer } from "../styles";
import { activeNavLink } from "./Nav";

interface NavProfilePictureProps
  extends NavLinkProps,
    React.RefAttributes<HTMLAnchorElement> {
  image: string | undefined;
  username: string | undefined;
}

/**
 * User profile picture component, used in the app's header.
 */
const NavProfilePicture = ({
  image,
  username,
  ...props
}: NavProfilePictureProps) => (
  <NavLink
    css={link}
    style={({ isActive }) => (isActive ? activeNavLink : {})}
    title="Go to your profile"
    {...props}
  >
    <div css={imageContainer}>
      <ChatThumbnail src={image} css={pictureImg} />
    </div>
    <p>{username}</p>
  </NavLink>
);

const link = css`
  ${infoButton};
  text-decoration: none;
  color: ${COLORS.WHITE};
  font-size: ${FONT_SIZES.S};
  flex-direction: column;

  @media (min-width: 576px) {
    flex-direction: row;
    font-size: ${FONT_SIZES.M};
  }
`;

const pictureImg = css`
  flex: 1 0 auto;
`;

const imageContainer = css`
  ${thumbnailContainer};
  height: 1.5rem;
  width: 1.5rem;
  flex: 1 0 auto;
`;

export default NavProfilePicture;
