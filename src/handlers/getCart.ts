import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";
import checkUser from "./checkUser";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    if(TOKEN == null)
        return response(400, "invalid token");
    const USERNAME: string = await checkUser(TOKEN);
    if(USERNAME == null)
        return response(400, "invalid token");
    const MODEL: Model = Model.createModel();
    const CART: JSON = MODEL.getCart(USERNAME);
    return response(200, "success", CART);
}