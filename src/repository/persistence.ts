import { Cart } from "../core/cart";

export interface Persistence {
    getCart (id: string): Promise<Cart>;
    deleteCart (id: string): Promise<boolean>;
    addToCart (cartId: string, productId: string, quantity: number): Promise<boolean>;
    removeFromCart (cartId: string, productId: string): Promise<boolean>;
    getProductQuantity(cartID: string, productId: string): Promise<number>;
}