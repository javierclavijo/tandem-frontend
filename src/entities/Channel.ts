export interface ChannelMembershipUser {
    id: string;
    url: string;
    username: string;
    description: string;
}

export interface ChannelMembership {
    id: string,
    url: string,
    user: ChannelMembershipUser,
    role: string,
}

export interface Channel {
    id: string;
    url: string;
    name: string;
    description: string;
    language: string;
    level: string;
    memberships: ChannelMembership[];
    image: string;
    // Convenience attribute used to have a uniform accessor to the chat's user or channel
    infoUrl: string;
    // Contains the URL for the endpoint to fetch the channel's chat messages
    messageUrl: string,
    // Type attribute, must be 'channel' in practice. Set to 'user' | 'channel' to be able to use it in the Chat
    // interface.
    type: "users" | "channels";
}
