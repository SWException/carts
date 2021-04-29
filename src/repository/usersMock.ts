import { Users } from "./users";

export class UsersMock implements Users {
    public async getUsername (token: string): Promise<string> {
        if (token != null) 
            return "pippo";
        throw new Error("Invalid token");
    }
}