import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    const PRODUCT_ID: string = event.pathParameters?.id;
    if(TOKEN == null || PRODUCT_ID == null)
        return response(400, "invalid request");
    const MODEL: Model = Model.createModel();
    return await MODEL.removeFromCart(TOKEN, PRODUCT_ID)
        .then((result: boolean) => result ? response(200, "success"):response(400, "failure"))
        .catch((err: Error) => response(400, err.message));
}