import {User} from "./User";
import {Channel} from "./Channel";

export interface Membership {
    id: string,
    url: string,
    channel: Channel,
    user: User,
    role: string,
}
