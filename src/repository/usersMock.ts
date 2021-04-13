import { Users } from "./users";

export class UsersMock implements Users {
    public async getUsername (token: string): Promise<string> {
        return token ? "1" : null;
    }
}