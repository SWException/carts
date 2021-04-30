import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const CUSTOMER_TOKEN: string = event.headers?.Authorization;
    const GUEST_TOKEN: string = event.headers?.guestToken
    if(CUSTOMER_TOKEN == null || GUEST_TOKEN == null)
        response(400, "bad request");
    const MODEL: Model = Model.createModel();
    return await MODEL.authCart(CUSTOMER_TOKEN, GUEST_TOKEN)
        .then((result: boolean) => result ? response(200, "success"):response(400, "error"))
        .catch((err: Error) => response(400, err.message));
}