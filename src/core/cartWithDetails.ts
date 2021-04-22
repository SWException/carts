import { Product } from "./product";

export class CartWithDetails {
    private readonly id: string;
    private readonly products: Array<Product>;
    private readonly total: number;
    private readonly taxes: number;

    constructor (id: string, products: Array<Product> ) {

    }
}