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
}
