export class Cart {
    getID() {
        throw new Error("Method not implemented.");
    }
    private readonly id: string;
    private readonly products: Map<string, number>; // id prodotto associato a quantità

    constructor (id: string, products: Map<string, number>) {
        this.id = id;
        this.products = products;
    }

    public addToCart (productId: string, quantity: number): void{
        if(this.products[productId] == null)
            this.products[productId] = 0;
        this.products[productId] += quantity;
    }

    public removeFromCart (productId: string): void {
        this.products.delete(productId);
    }

    public getProducts (): Map<string, number> {
        return this.products;
    }

    public getId (): string {
        return this.id;
    }
}