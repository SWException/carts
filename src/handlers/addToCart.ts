import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";
import checkUser from "./checkUser";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    const PRODUCT_ID: string = event.pathParameters?.id;
    const QUANTITY = Number(event.headers?.quantity);
    if(TOKEN == null || PRODUCT_ID == null || QUANTITY == null)
        return response(400, "invalid request");
    const USERNAME: string = await checkUser(TOKEN);
    if(USERNAME == null)
        return response(400, "invalid token");
    const MODEL: Model = Model.createModel();
    const RESULT: boolean = MODEL.addToCart(USERNAME, PRODUCT_ID, QUANTITY);
    return RESULT ? response(200, "success") : response(400, "failure");
}