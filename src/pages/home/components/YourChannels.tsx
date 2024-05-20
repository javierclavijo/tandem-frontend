import { Link } from "react-router-dom";
import { animated } from "react-spring";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import { getChatLastMessageDisplayText } from "../../../common/functions";
import { homeSearchStyles } from "../../../common/styles";
import { useFadeIn } from "../../../common/transitions";
import { useChannelChatList } from "../../chats/queries";
import RecentElement from "./RecentElement";

const YourChannels = () => {
  const transitionProps = useFadeIn();
  const { user } = useAuth();

  const { data: channelChats } = useChannelChatList();

  const displayedChannelChats = channelChats?.slice(0, 6);

  return (
    <animated.section css={homeSearchStyles.section} style={transitionProps}>
      <header>
        <h3 css={homeSearchStyles.sectionHeading}>Your channels</h3>
      </header>
      <div css={homeSearchStyles.sectionItemsContainer}>
        {displayedChannelChats?.map((chat) => (
          <RecentElement
            name={chat.name}
            image={chat.image}
            content={getChatLastMessageDisplayText(chat.messages[0], user)}
            link={`/chats/${chat.id}`}
            key={chat.id}
          />
        ))}
        {!channelChats?.length ? (
          <p>You haven&apos;t joined any chats yet.</p>
        ) : null}
      </div>
      <footer css={homeSearchStyles.sectionFooter}>
        <Link
          to="/chats"
          css={homeSearchStyles.sectionFooterLink}
          title="See all chats"
        >
          See all
        </Link>
      </footer>
    </animated.section>
  );
};

export default YourChannels;
