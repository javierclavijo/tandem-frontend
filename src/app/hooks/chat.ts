import {useQuery} from "react-query";
import {Chat} from "../../entities/Chat";
import {axiosApi} from "../AuthContext";


const chatSortFn = (a: Chat, b: Chat) => {
    const aLatestMessageTimestamp = a.messages[0].timestamp;
    const bLatestMessageTimestamp = b.messages[0].timestamp;

    if (aLatestMessageTimestamp > bLatestMessageTimestamp) {
        return -1;
    } else if (bLatestMessageTimestamp > aLatestMessageTimestamp) {
        return 1;
    } else {
        return 0;
    }
};

const fetchChatList = async () => {
    const userChatsResponse = await axiosApi.get("/user_chats");
    const channelChatsResponse = await axiosApi.get("/channel_chats");
    return [...userChatsResponse.data.results, ...channelChatsResponse.data.results];
};

export const useChatList = () => {
    return useQuery<Chat[]>(["chats", "list"], fetchChatList, {
        // Whenever data is either fetched or updated with setQueryData(), sort chats according to their latest messages
        onSuccess: (data) => data.sort(chatSortFn)
    });
};
