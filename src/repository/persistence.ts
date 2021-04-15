import { Category } from "src/core/category"

export interface Persistence {
    getAll(): Promise<Array<Category>>;
    getItem(id: string): Promise<Category>;
    addItem(item: Tax): Promise<boolean>;
    editItem(item: Tax): Promise<boolean>;
    deleteItem(id: string): Promise<boolean>;
}