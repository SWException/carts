import fetch from "node-fetch";
import { Users } from "./users";

export class UsersService implements Users {
    public async getUsername (token: string): Promise<string> {
        return await fetch(process.env.SERVICES + `/users/customers/check/${token}`)
            .then(async responseUser => {
                return responseUser.status == 200 ? responseUser.body["data"]["username"] : null;
            })
            .catch(error => {
                return error.message;
            });
    }
}