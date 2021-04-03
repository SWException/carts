export class Cart {
    private readonly id: string;
    private readonly products: Map<string, number>; // id prodotto associato a quantità

    constructor (id: string, products: Map<string, number>) {
        this.id = id;
        this.products = products;
    }

    public getProducts (): Map<string, number> {
        return this.products;
    }
}