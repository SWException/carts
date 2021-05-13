import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    let token: string = event.headers?.Authorization;
    let isGuest = false;
    if(token == null) {
        token = event.queryStringParameters?.guestToken;
        isGuest = true;
        if(token == null)
            return response(400, "invalid token");
    }
    const MODEL: Model = Model.createModel();
    return await MODEL.deleteCart(token, isGuest)
        .then((result: boolean) => result ? response(200, "success"):response(400, "failure"))
        .catch((err: Error) => response(400, err.message));
}