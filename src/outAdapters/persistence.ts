import { Cart } from "../core/cart";

export interface Persistence {
    getCart (id: string): Cart;
    deleteCart (id: string): boolean;
    addToCart (cartId: string, productId: string, quantity: number): boolean;
    removeFromCart (cartId: string, productId: string): boolean;
}