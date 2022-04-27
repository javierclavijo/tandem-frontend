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
    description: string;
    language: string;
    level: string;
    memberships: ChannelMembership[];
    image: string;
    // Convenience attributes which contain info about the chat's channel or user.
    info_url: string;
    name: string;
    // Type attribute, must be 'channel' in practice. Set to 'user' | 'channel' to be able to use it in the Chat
    // interface.
    type: "users" | "channels";
}
