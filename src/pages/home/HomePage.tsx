import { animated } from "react-spring";
import Header from "../../common/components/Header/Header";
import Tabs from "../../common/components/Tabs";
import useAuth from "../../common/context/AuthContext/AuthContext";
import { homeSearchStyles } from "../../common/styles";

import { Helmet } from "react-helmet-async";
import { ResponsiveBottomTabsLayout } from "../../common/components/Layout";
import { useWsChatListener } from "../../common/hooks";
import { homeSearchMain } from "../../common/styles";
import { useFadeIn } from "../../common/transitions";
import Discover from "./components/Discover";
import RecentChats from "./components/RecentChats";
import YourChannels from "./components/YourChannels";

/**
 * Post-login home page.
 */
const HomePage = () => {
  const transitionProps = useFadeIn();
  const { user } = useAuth();
  useWsChatListener();

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
            {user != null && <p>Welcome back, {user.username}</p>}
          </animated.header>

          <RecentChats />
          <YourChannels />
          <Discover />
        </main>

        <Tabs />
      </ResponsiveBottomTabsLayout>
    </>
  );
};

export default HomePage;
