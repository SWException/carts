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
    const BODY = JSON.parse(event.body);
    
    const PRODUCT_ID: string = BODY?.id;
    const QUANTITY = Number(BODY?.quantity);
    if(token == null || PRODUCT_ID == null || QUANTITY == null){
        return response(400, "invalid request. Missing properties");
    }
    console.log("updateCart");
    
    const MODEL: Model = Model.createModel();
    console.log("Model created");
    
    return await MODEL.updateCart(token, PRODUCT_ID, QUANTITY, isGuest)
        .then((result: boolean) => result ? response(200, "success"):response(400, "failure"))
        .catch((err: Error) => response(400, err.message));
}