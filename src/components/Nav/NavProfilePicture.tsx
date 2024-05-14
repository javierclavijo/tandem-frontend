import { css } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { COLORS, FONT_SIZES } from "../../common/resources/style-variables";
import { User } from "../../common/types";
import { infoButton } from "../../pages/chats/styles";
import ChatThumbnail from "../ChatThumbnail";
import { thumbnailContainer } from "../styles";
import { activeNavLink } from "./Nav";

interface NavProfilePictureProps {
  user: User | undefined;
}

/**
 * User profile picture component, used in the app's header.
 */
function NavProfilePicture({ user }: NavProfilePictureProps) {
  return (
    <NavLink
      to={`/chats/users/${user?.id}`}
      css={link}
      style={({ isActive }) => (isActive ? activeNavLink : {})}
      title="Go to your profile"
    >
      <div css={imageContainer}>
        <ChatThumbnail src={user?.image} css={pictureImg} />
      </div>
      <p>{user?.username}</p>
    </NavLink>
  );
}

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