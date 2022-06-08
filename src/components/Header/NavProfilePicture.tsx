/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "../../entities/User";
import { infoButton } from "../../features/info/styles";
import { thumbnailContainer, thumbnailImg } from "../../styles/components";
import { colors, textSizes } from "../../styles/variables";
import { activeNavLink } from "./Nav";

const defaultImg = require("../../static/images/user_placeholder.png");

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
    >
      <div css={imageContainer}>
        <img
          src={user?.image ?? defaultImg}
          alt={user?.username}
          css={pictureImg}
        />
      </div>
      <p>{user?.username}</p>
    </NavLink>
  );
}

const link = css`
  ${infoButton};
  text-decoration: none;
  color: ${colors.WHITE};
  font-size: ${textSizes.M};
`;

const pictureImg = css`
  ${thumbnailImg};
  flex: 1 0 auto;
`;

const imageContainer = css`
  ${thumbnailContainer};
  height: 1.5rem;
  width: 1.5rem;
  flex: 1 0 auto;
`;

export default NavProfilePicture;
