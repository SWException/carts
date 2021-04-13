import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";

export class Dynamo implements Persistence {
    getCart (id: string): Cart {
        // TO-DO Marco
        return null;
    }
    deleteCart (id: string): boolean {
        // TO-DO Marco
        return false;
    }
    addToCart (cartId: string, productId: string, quantity: number): boolean {
        // TO-DO Marco
        return false;
    }
    removeFromCart (cartId: string, productId: string): boolean {
        // TO-DO Marco
        return false;
    }

}