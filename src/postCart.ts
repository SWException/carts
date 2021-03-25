import { APIGatewayProxyHandler } from 'aws-lambda';
import Cart from 'src/Cart';
import User from 'src/User';
import API_RESPONSES from "src/utils/apiResponses"
import { getTokenFromEvent, getBodyDataFromEvent } from "src/utils/checkJWT";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    //console.log("event", event);

    let token = getTokenFromEvent(event);
    let cartID = null;
    if (token == null) {
        token = event.headers?.guestToken;
        if (token == null) {
            return API_RESPONSES._400(null, "error", "manca token");
        }
        else {
            cartID = token
        }
    }
    else {
        const USER: User = await User.createUser(token);
        if (USER && USER.isAuthenticate() && USER.isClient()) {
            cartID = USER.getUsername();
        }
        else {
            return API_RESPONSES._400(null,
                "error", "token non valido o scaduto");
        }
    }

    const DATA = getBodyDataFromEvent(event);
    const RES: boolean = await Cart.addProduct(cartID, DATA);

    console.log(JSON.stringify(RES));

    return API_RESPONSES._200({ RES });
}
