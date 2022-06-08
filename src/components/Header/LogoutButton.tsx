/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { LogOut } from "iconoir-react";
import React from "react";
import { infoButton } from "../../features/info/styles";
import { colors, textSizes } from "../../styles/variables";

interface LogoutButtonProps {
  handleLogout: () => Promise<void>;
}

/**
 * Logout button used in the header navbar.
 */
function LogoutButton({ handleLogout }: LogoutButtonProps) {
  return (
    <button type="button" onClick={handleLogout} css={logoutButton}>
      <LogOut color={colors.WHITE} width="1.5rem" height="1.5rem" />
      Log out
    </button>
  );
}

const logoutButton = css`
  ${infoButton};
  font-size: ${textSizes.M};
`;

export default LogoutButton;
