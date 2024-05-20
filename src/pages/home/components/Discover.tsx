import { Link } from "react-router-dom";
import { animated } from "react-spring";
import UserCard from "../../../common/components/UserCard";
import { homeSearchStyles } from "../../../common/styles";
import { useFadeIn } from "../../../common/transitions";
import { useDiscoverUsersList } from "../queries";

/**
 * Displays a list of randomized users, excluding friends of the user.
 */
const Discover = () => {
  const transitionProps = useFadeIn();
  const { data: discoverUsers } = useDiscoverUsersList();

  const displayedDiscoverUsers = discoverUsers?.slice(0, 9);

  return (
    <animated.section css={homeSearchStyles.section} style={transitionProps}>
      <header>
        <h3 css={homeSearchStyles.sectionHeading}>Discover</h3>
      </header>
      <div css={homeSearchStyles.sectionItemsContainer}>
        {displayedDiscoverUsers?.map((user) => (
          <UserCard
            name={user.username}
            languages={user.languages.map(({ language }) => language)}
            content={user.description}
            link={`/chats/users/${user.id}`}
            image={user.image}
            key={user.id}
            maxContentLines={1}
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
  );
};

export default Discover;
