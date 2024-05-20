import { Link } from "react-router-dom";
import { animated } from "react-spring";
import useAuth from "../../../common/context/AuthContext/AuthContext";
import { getChatLastMessageDisplayText } from "../../../common/functions";
import { homeSearchStyles } from "../../../common/styles";
import { useFadeIn } from "../../../common/transitions";
import { useFriendChatList } from "../../chats/queries";
import RecentElement from "./RecentElement";

const RecentChats = () => {
  const transitionProps = useFadeIn();
  const { user } = useAuth();

  const { data: friendChats } = useFriendChatList();
  const displayedFriendChats = friendChats?.slice(0, 6);

  return (
    <animated.section css={homeSearchStyles.section} style={transitionProps}>
      <header>
        <h3 css={homeSearchStyles.sectionHeading}>Recent chats</h3>
      </header>
      <div css={homeSearchStyles.sectionItemsContainer}>
        {displayedFriendChats?.map((chat) => (
          <RecentElement
            name={chat.name}
            image={chat.image}
            content={getChatLastMessageDisplayText(chat.messages[0], user)}
            link={`/chats/${chat.id}`}
            key={chat.id}
          />
        ))}
        {!friendChats?.length ? (
          <p>You haven&apos;t chatted with anyone yet.</p>
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

export default RecentChats;
