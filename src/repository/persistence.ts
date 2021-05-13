import { Cart } from "../core/cart";

export interface Persistence {
    getItem (id: string): Promise<Cart>;
    deleteCart (id: string): Promise<boolean>;
    updateCart (cart: Cart): Promise<boolean>;

}