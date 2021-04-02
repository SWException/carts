import { InPort } from "../../handlers/inPort";
import { Cart } from "../cart";

export class Model implements InPort {
    getCart (id: string): JSON {
        throw new Error("Method not implemented.");
    }
    deleteCart (id: string): boolean {
        throw new Error("Method not implemented.");
    }
    addToCart (cartId: string, productId: string, quantity: number): boolean {
        throw new Error("Method not implemented.");
    }
    removeFromCart (cartId: string, productId: string): boolean {
        throw new Error("Method not implemented.");
    }

}