import fetch from 'node-fetch';

export default async function checkUser (token: string): Promise<string> {
    return await fetch(process.env.SERVICES + "/dev/users/check/" + token)
        .then((response) => {
            if(response.status != 200)
                return null;
            return response.body["username"];
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}