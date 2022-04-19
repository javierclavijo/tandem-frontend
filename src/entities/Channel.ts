import {Membership} from "./Membership";

export interface Channel {
    id: string;
    url: string;
    name: string;
    description: string;
    language: string;
    level: string;
    memberships: Membership[];
}
