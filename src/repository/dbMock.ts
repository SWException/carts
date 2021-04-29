import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";

export class DbMock implements Persistence {

    private static readonly CART_FAKE: Map<string, number> = new Map([
        ["aaa", 2]
    ])

    public async getItem (id: string): Promise<Cart> {
        if(id)
            return new Cart("user123", DbMock.CART_FAKE);
        else
            return null;
    }
    public async deleteCart (id: string): Promise<boolean> {
        if(id != null)
            return true;
        else
            return false;
    }
    public async updateCart (cart: Cart): Promise<boolean> {
        if(cart != null)
            return true;
        else
            return false;
    }

}