import { Cart } from "src/core/cart"

export interface Persistence {
    getAll(): Promise<Array<Cart>>;
    getItem(id: string): Promise<Cart>;
    addItem(item: Tax): Promise<boolean>;
    editItem(item: Tax): Promise<boolean>;
    deleteItem(id: string): Promise<boolean>;
}