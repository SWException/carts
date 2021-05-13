import { Users } from "./users";

export class UsersMock implements Users {
    public async getUsername (token: string): Promise<string> {
        if (token == "1" || token == "pippo" ) return "pippo";
        if (token == "guest_1" ) return "guest_1";
        if (token == "guest_3") return "guest_3";
        else if( token != null ) return "pippo";
    }
}