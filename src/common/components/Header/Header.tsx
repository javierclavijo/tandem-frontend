import { css } from "@emotion/react";
import { ChatLines, Home, LogOut, Search } from "iconoir-react";
import { Link, NavLink } from "react-router-dom";
import langflowLogo from "../../../common/static/svg/langflow_logo.svg";
import { infoButton } from "../../../pages/chats/styles";
import { COLORS, FONT_SIZES } from "../../constants";
import useAuth from "../../context/AuthContext/AuthContext";
import { useIsDesktop } from "../../hooks";
import HeaderProfilePicture from "./HeaderProfilePicture";

/**
 * Main header component. Renders differently according to the viewport width and to whether the user is logged in.
 */
const Header = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const isDesktop = useIsDesktop();

  return (
    <header css={header}>
      <nav css={nav} role="navigation">
        <Link to="/" css={titleLink}>
          <img src={langflowLogo} alt="LangFlow" css={logo} />
          <h1 css={title}>LangFlow</h1>
        </Link>
        <ul css={navList}>
          {isLoggedIn ? (
            isDesktop ? (
              // Post-login desktop header
              <>
                <li>
                  <NavLink
                    to="/"
                    css={link}
                    style={({ isActive }) => (isActive ? activeNavLink : {})}
                  >
                    <Home color={COLORS.WHITE} width="1.5rem" height="1.5rem" />
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/chats"
                    css={link}
                    style={({ isActive }) => (isActive ? activeNavLink : {})}
                    end
                  >
                    <ChatLines
                      color={COLORS.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Chats
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/search"
                    css={link}
                    style={({ isActive }) => (isActive ? activeNavLink : {})}
                  >
                    <Search
                      color={COLORS.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Search
                  </NavLink>
                </li>
                <li>
                  <HeaderProfilePicture
                    to={`/chats/users/${user?.id}`}
                    image={user?.image}
                    username={user?.username}
                  />
                </li>
                <li>
                  <button type="button" onClick={logout} css={logoutButton}>
                    <LogOut
                      color={COLORS.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Log out
                  </button>
                </li>
              </>
            ) : (
              // Post-login mobile header
              <>
                <li>
                  <HeaderProfilePicture
                    to={`/chats/users/${user?.id}`}
                    image={user?.image}
                    username={user?.username}
                  />
                </li>
                <li>
                  <button type="button" onClick={logout} css={logoutButton}>
                    <LogOut
                      color={COLORS.WHITE}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    Log out
                  </button>
                </li>
              </>
            )
          ) : (
            // Pre-login header
            <>
              <li>
                <NavLink
                  to="/auth/login"
                  css={link}
                  style={({ isActive }) => (isActive ? activeNavLink : {})}
                >
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/auth/register"
                  css={link}
                  style={({ isActive }) => (isActive ? activeNavLink : {})}
                >
                  Sign in
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

const header = css`
  grid-area: header;
  height: 100%;
`;

const nav = css`
  height: 100%;
  background: ${COLORS.DARK_PRIMARY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding: 0 3.125rem;
  }
`;

const logo = css`
  max-height: 3rem;
`;

const title = css`
  color: ${COLORS.WHITE};
  margin: 0;
  font-size: ${FONT_SIZES.L};

  @media (min-width: 576px) {
    font-size: ${FONT_SIZES.XL};
  }
`;

const navList = css`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style-type: none;
  gap: 0.25rem;

  @media (min-width: 576px) {
    gap: 2rem;
  }
`;

export const link = css`
  ${infoButton};
  text-decoration: none;
  color: ${COLORS.WHITE};
  font-size: ${FONT_SIZES.M};
  text-align: center;
`;

export const titleLink = css`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const activeNavLink = {
  borderBottom: `2px solid ${COLORS.SECONDARY}`,
};

const logoutButton = css`
  ${infoButton};
  font-size: ${FONT_SIZES.S};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 576px) {
    flex-direction: row;
    font-size: ${FONT_SIZES.M};
  }
`;

export default Header;
