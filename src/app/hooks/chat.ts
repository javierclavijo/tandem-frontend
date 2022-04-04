import {useQuery} from "react-query";
import {Chat} from "../../entities/Chat";
import useAuth, {axiosApi} from "../AuthContext";
import React from "react";

const fetchChannelChatList = async () => {
    const response = await axiosApi.get("/channel_chats");
    return response.data.results;
};

const fetchUserChatList = async () => {
    const response = await axiosApi.get("/user_chats");
    return response.data.results;
};

export const useChatList = () => {

    const [data, setData] = React.useState<Chat[]>([]);
    const {isLoggedIn, loading} = useAuth();

    const {data: channelChatListData, isSuccess: channelChatListFetchIsSuccess} = useQuery<Chat[]>(
        ["chats", "channel"],
        fetchChannelChatList,
        {
            // Wait for the user to be logged in to fetch data
            enabled: isLoggedIn && !loading
        }
    );

    const {data: userChatListData, isSuccess: userChatListFetchIsSuccess} = useQuery<Chat[]>(
        ["chats", "user"],
        fetchUserChatList,
        {
            enabled: isLoggedIn && !loading
        }
    );


    React.useEffect(() => {
        if (channelChatListFetchIsSuccess && userChatListFetchIsSuccess) {
            // Concat the data returned from both queries and sort according to the latest message's datetime before
            // setting it as the current state
            const chats = channelChatListData.concat(userChatListData);
            chats.sort((a, b) => {
                const aLatestMessageTimestamp = a.messages[0].timestamp;
                const bLatestMessageTimestamp = b.messages[0].timestamp;

                if (aLatestMessageTimestamp > bLatestMessageTimestamp) {
                    return -1;
                } else if (bLatestMessageTimestamp > aLatestMessageTimestamp) {
                    return 1;
                } else {
                    return 0;
                }
            });

            setData(chats);
        }
    }, [userChatListData, channelChatListData, channelChatListFetchIsSuccess, userChatListFetchIsSuccess]);

    return data;
};