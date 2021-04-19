import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";

export class DbMock implements Persistence {

    private static readonly CART_FAKE: Map<string, number> = new Map([
        ["aaa", 2],
        ["bbb", 3],
        ["ccc", 1]
    ])

    public async getItem (id: string): Promise<Cart> {
        return new Cart("user123", DbMock.CART_FAKE);
    }
    public async deleteCart (id: string): Promise<boolean> {
        return true;
    }
    public async updateCart (cart: Cart): Promise<boolean> {
        return true;
    }

}