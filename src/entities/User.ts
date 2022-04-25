export interface UserMembershipChannel {
    id: string;
    url: string;
    name: string;
    description: string;
    language: string;
    level: string;
}

export interface UserMembership {
    id: string;
    url: string;
    channel: UserMembershipChannel;
    role: string;
}

export interface NestedUser {
    id: string;
    url: string;
    username: string;
    description: string;
}

export interface Language {
    language: string,
    level: string,
}

export interface User {
    id: string,
    url: string,
    username: string,
    description: string,
    friends: NestedUser[],
    languages: Language[],
    memberships: UserMembership[],
}
