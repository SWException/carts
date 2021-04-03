import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";

export class DbMock implements Persistence {

    private static readonly CART_FAKE: Map<string, number> = new Map([
        ["aaa", 2],
        ["bbb", 3],
        ["ccc", 1]
    ])

    getCart (id: string): Cart {
        return new Cart("user123", DbMock.CART_FAKE);
    }
    deleteCart (id: string): boolean {
        return true;
    }
    addToCart (cartId: string, productId: string, quantity: number): boolean {
        return true;
    }
    removeFromCart (cartId: string, productId: string): boolean {
        return true;
    }
    
}