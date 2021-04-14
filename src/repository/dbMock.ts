import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";

export class DbMock implements Persistence {

    private static readonly CART_FAKE: Map<string, number> = new Map([
        ["aaa", 2],
        ["bbb", 3],
        ["ccc", 1]
    ])

    public async getCart (id: string): Promise<Cart> {
        return new Cart("user123", DbMock.CART_FAKE);
    }
    public async deleteCart (id: string): Promise<boolean> {
        return true;
    }
    public async addToCart (cartId: string, productId: string, quantity: number): Promise<boolean> {
        return true;
    }
    public async removeFromCart (cartId: string, productId: string): Promise<boolean> {
        return true;
    }
    
    public async getProductQuantity (cartId: string, productId: string): Promise<number> {
        return 0;
    }

}