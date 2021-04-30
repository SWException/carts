import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";

export class DbMock implements Persistence {
    public async getItem (id: string): Promise<Cart> {
        if(id=="1") {
            const CART_FAKE: Map<string, number> = new Map<string, number>();
            CART_FAKE.set("test_product", 2);
            CART_FAKE.set("product_2", 50);
            return new Cart("user123", CART_FAKE);
        }
        else  if(id=="guest_1") {
            const CART_FAKE: Map<string, number> = new Map<string, number>();
            CART_FAKE.set("test_product", 3);
            return new Cart("user123", CART_FAKE);
        }
           else  return null;


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