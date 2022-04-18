import {User} from "./User";
import {Channel} from "./Channel";

export interface Membership {
    url: string,
    channel: Channel | undefined,
    user: User | undefined,
    role: string,
}
