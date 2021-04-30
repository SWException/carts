import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    let token: string = event.headers?.Authorization;
    let isGuest = false;
    if(token == null) {
        token = event.headers?.guestToken;
        isGuest = true;
    }
    const PRODUCT_ID: string = event.pathParameters?.id;
    if(token == null || PRODUCT_ID == null)
        return response(400, "invalid request");
    const MODEL: Model = Model.createModel();
    return await MODEL.removeFromCart(token, PRODUCT_ID, isGuest)
        .then((result: boolean) => result ? response(200, "success"):response(400, "failure"))
        .catch((err: Error) => response(400, err.message));
}