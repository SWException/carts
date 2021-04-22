import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponse';
import { Model } from "../core/model";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    const BODY = JSON.parse(event.body);
    const PRODUCT_ID: string = BODY?.id; 
    const QUANTITY = Number(BODY?.quantity);
    if(TOKEN == null || PRODUCT_ID == null || QUANTITY == null)
        return response(400, "invalid request");
    const MODEL: Model = Model.createModel();
    const RESULT: boolean = await MODEL.addToCart(TOKEN, PRODUCT_ID, QUANTITY);
    console.log(RESULT);
    return RESULT ? response(200, "success") : response(400, "failure");

}