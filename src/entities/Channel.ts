import {Membership} from "./Membership";

export interface Channel {
    id: string;
    url: string;
    name: string;
    description: string;
    language: string;
    start_proficiency_level: string;
    end_proficiency_level: string;
    memberships: Membership[];
}