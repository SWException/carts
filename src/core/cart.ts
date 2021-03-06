export class Cart {
    private readonly id: string;
    private readonly products: Map<string, number> = new Map<string, number>();

    constructor (id: string, products?: Map<string, number>) {
        this.id = id;
        this.products = products ? products : new Map<string, number>();
    }

    public addToCart (productId: string, quantity: number): void{
        console.log("CART addToCart. Products before add ", this.products);
        
        if(this.products.get(productId) != null && this.products.get(productId) > 0){
            const QTA = this.products.get(productId);
            this.products.set(productId, quantity + QTA);
        }
        else{
            console.log("Aggiungo il nuovo prodotto");
            this.products.set(productId, quantity);
        }
        console.log("CART addToCart. Products after add ", this.products);
    }

    public updateCart (productId: string, quantity: number): void{
        if(this.products.get(productId) == null){
            console.log("updateCart. Ehi product null");
            return;
        }
        console.log("aggiorno quantità", quantity);
        
        this.products.set(productId, quantity);
    }

    public removeFromCart (productId: string): void {
        this.products.delete(productId);
    }

    public getProducts (): Map<string, number> {
        if(this.products)
            return this.products;
        else return null;
    }

    public getId (): string {
        return this.id;
    }

    public getQuantity (id: string): number {
        if(this.products.size > 0)
            return this.products.get(id) ? this.products.get(id) : 0;
        return 0;
    }

    public isEmpty (): boolean {
        return this.products.size == 0;
    }

    public contains (id: string): boolean {
        if(this.products.size > 0)
            return this.products.get(id) > 0;
    
        return false;
    }
}