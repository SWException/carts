export class Cart {
    private readonly id: string;
    private readonly products: Map<string, number> = new Map<string, number>();

    constructor (id: string, products?: Map<string, number>) {
        this.id = id;
        this.products = products ? products : new Map<string, number>();
    }

    public addToCart (productId: string, quantity: number): void{
        if(this.products[productId] == null)
            this.products[productId] = 0;
        this.products[productId] += quantity;
    }

    public updateCart (productId: string, quantity: number): void{
        if(this.products[productId] == null){
            console.log("updateCart. Ehi product null");
            return;
        }
        console.log("aggiorno quantità", quantity);
        
        this.products[productId] = quantity;
    }

    public removeFromCart (productId: string): void {
        delete this.products[productId];
        return;
    }

    public getProducts (): Map<string, number> {
        return this.products;
    }

    public getId (): string {
        return this.id;
    }

    public getQuantity (id: string): number {
        return this.products[id] != null ? this.products[id] : 0;
    }

    public isEmpty (): boolean {
        return this.products.size == 0;
    }
}