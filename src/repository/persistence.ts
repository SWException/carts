import { Cart } from "../core/cart";

export interface Persistence {
    getCart (id: string): Promise<Cart>;
    deleteCart (id: string): Promise<boolean>;
    updateCart (cart: Cart): Promise<boolean>;
    removeFromCart (cartId: string, productId: string): Promise<boolean>;
}