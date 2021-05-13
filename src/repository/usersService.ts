import fetch from "node-fetch";
import { Users } from "./users";

export class UsersService implements Users {
    public async getUsername (token: string): Promise<string> {
        return await fetch(process.env.SERVICES + `/users/customers/check/${token}`)
            .then(res => res.json())
            .then(responseUser => {
                console.log("getUsername", responseUser);
                
                return responseUser.status == "success" ? responseUser["data"]["username"] : null;
            })
            .catch(() => {
                return null;
            });
    }
}