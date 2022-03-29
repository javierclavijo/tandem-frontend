import {Language} from "./Language";
import {Membership} from "./Membership";

export interface User {
    id: number,
    url: string,
    username: string,
    email: string,
    description: string,
    friends: User[],
    languages: Language[],
    memberships: Membership[],
}
