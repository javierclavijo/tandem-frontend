import { Link } from "react-router-dom";
import { animated } from "react-spring";
import Header from "../../common/components/Header/Header";
import SearchResultElement from "../../common/components/SearchResultElement";
import Tabs from "../../common/components/Tabs";
import useAuth from "../../common/context/AuthContext/AuthContext";
import { homeSearchStyles } from "../../common/styles";

import { Helmet } from "react-helmet-async";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import { useWsChatListener } from "../../common/hooks";
import { homeSearchMain } from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import RecentChats from "./components/RecentChats";
import YourChannels from "./components/YourChannels";
import { useDiscoverUsersList } from "./queries";

/**
 * Post-login home page.
 */
const HomePage = () => {
  const transitionProps = useFadeIn();
  const { user } = useAuth();
  useWsChatListener();

  const { data: discoverUsers } = useDiscoverUsersList();

  const displayedDiscoverUsers = discoverUsers?.slice(0, 9);

  if (user == null) {
    return null;
  }

  return (
    <>
      <Helmet title="Home | LangFlow" />
      <ResponsiveBottomTabsLayout>
        <Header />
        <main css={homeSearchMain}>
          <animated.header
            css={homeSearchStyles.header}
            style={transitionProps}
          >
            <h2 css={homeSearchStyles.h2}>Home</h2>
            <p>Welcome back, {user.username}</p>
          </animated.header>

          <RecentChats />
          <YourChannels />

          {/* 'Discover' section. Contains a list of randomized users, excluding
              friends of the user. */}
          <animated.section
            css={homeSearchStyles.section}
            style={transitionProps}
          >
            <header>
              <h3 css={homeSearchStyles.sectionHeading}>Discover</h3>
            </header>
            <div css={homeSearchStyles.sectionItemsContainer}>
              {displayedDiscoverUsers?.map((user) => (
                <SearchResultElement
                  id={user.id}
                  name={user.username}
                  languages={user.languages.map(({ language }) => language)}
                  description={user.description}
                  link={`/chats/users/${user.id}`}
                  image={user.image}
                  key={user.id}
                />
              ))}
            </div>
            <footer css={homeSearchStyles.sectionFooter}>
              <Link
                to="/search"
                css={homeSearchStyles.sectionFooterLink}
                title="Go to search page"
              >
                See more
              </Link>
            </footer>
          </animated.section>
        </main>

        <Tabs />
      </ResponsiveBottomTabsLayout>
    </>
  );
};

export default HomePage;
