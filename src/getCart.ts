import { APIGatewayProxyHandler } from 'aws-lambda';
import Cart from 'src/Cart';
import User from 'src/User';
import API_RESPONSES from "src/utils/apiResponses"
import { getTokenFromEvent } from "src/utils/checkJWT";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
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
            return API_RESPONSES._400(null, "error",
                "token non valido o scaduto");
        }
    }

    const CART: Cart = await Cart.buildCart(cartID);

    console.log(JSON.stringify(CART));

    return API_RESPONSES._200(CART.getJson());
}
