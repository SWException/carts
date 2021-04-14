import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";

export class Dynamo implements Persistence {
    public async getCart (id: string): Promise<Cart> {
        // TO-DO Marco
        throw new Error("not implemented");
    }
    public async deleteCart (id: string): Promise<boolean> {
        // TO-DO Marco
        throw new Error("not implemented");
    }
    public async addToCart (cartId: string, productId: string, quantity: number): Promise<boolean> {
        // TO-DO Marco
        throw new Error("not implemented");
    }
    public async removeFromCart (cartId: string, productId: string): Promise<boolean> {
        // TO-DO Marco
        throw new Error("not implemented");
    }

    public async getProductQuantity (cartId: string, productId: string): Promise<number> {
        // TO-DO Marco
        throw new Error("not implemented");
    }

}