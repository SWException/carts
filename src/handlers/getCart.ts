import { APIGatewayProxyHandler } from 'aws-lambda';
import { CartWithDetails } from 'src/core/cartWithDetails';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    let token: string = event.headers?.Authorization;
    let isGuest = false;
    if(token == null) {
        token = event.queryStringParameters?.guestToken;
        isGuest = true;
    }
    console.log("token auth: "+event.headers?.Authorization);
    console.log("token guest: "+event.headers?.guestToken);
    
    const MODEL: Model = Model.createModel();
    return await MODEL.getCart(token, isGuest)
        .then((result: {cart: CartWithDetails, modified: boolean}) => {
            console.log("carrello ritornato con id: " + result.cart.getId());
            return response(200, (result.modified ? "something is missing":"success"), result.cart);
        })
        .catch((err: Error) =>{ 
            console.log("errore: "+ err.message);
            return response(400, err.message);
        });

    /*return await MODEL.getCart(token, isGuest)
        .then((result: {cart: CartWithDetails, modified: boolean}) => 
            response(200, (result.modified ? "something is missing":"success"), result.cart))
        .catch((err: Error) =>  response(400, err.message));*/
}