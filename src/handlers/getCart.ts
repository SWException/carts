import { APIGatewayProxyHandler } from 'aws-lambda';
import { CartWithDetails } from 'src/core/cartWithDetails';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    let token: string = event.headers?.Authorization;
    let isGuest = false;
    if(token == null) {
        token = event.headers?.guestToken;
        isGuest = true;
    }
    const MODEL: Model = Model.createModel();
    return await MODEL.getCart(token, isGuest)
        .then((cart: CartWithDetails) => 
            response(200, "success", cart))
        .catch((err: Error) =>  response(400, err.message));
}