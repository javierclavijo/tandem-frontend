import { Chat } from './Chat';

export interface ChannelMembershipUser {
  id: string;
  url: string;
  username: string;
  description: string;
  image: string | null;
}

export interface ChannelMembership {
  id: string,
  url: string,
  user: ChannelMembershipUser,
  role: string,
}

export interface Channel extends Chat {
  description: string;
  language: string;
  level: string;
  memberships: ChannelMembership[];
  type: 'channels';
}
