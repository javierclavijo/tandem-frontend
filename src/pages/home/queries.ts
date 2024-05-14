import qs from "qs";
import { useQuery } from "react-query";
import { axiosApi } from "../../api";
import { User } from "../../common/types";
import useAuth from "../auth/AuthContext/AuthContext";

/**
 * Fetches a list of random users who aren't friends of the session's user,
 * adding parameters based on the user's languages.
 * @param user The session' user object.
 * @returns An array of users, or an empty array, if the user object is
 * undefined.
 */
const fetchDiscoverUsersList = async (user: User | undefined) => {
  if (user) {
    const response = await axiosApi.get(`users/discover/`, {
      // Add the user's learning languages as the native languages for the
      // query, and viceversa.
      params: {
        native_language: user.languages.filter(
          (language) => language.level !== "NA",
        ),
        learning_language: user.languages.filter(
          (language) => language.level === "NA",
        ),
        size: 9,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data.results;
  }
  return [];
};

/**
 * Fetches a list of random users who aren't friends of the session's user,
 * adding parameters based on the user's languages.
 */
export const useDiscoverUsersList = () => {
  const { user } = useAuth();
  return useQuery<User[]>(
    ["home", "discover", "users"],
    async () => await fetchDiscoverUsersList(user),
    {
      enabled: !!user,
      staleTime: Infinity,
    },
  );
};
