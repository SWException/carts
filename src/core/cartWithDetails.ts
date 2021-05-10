import { Product } from "./product";

export class CartWithDetails {
    private readonly id: string;
    private readonly products: Array<Product>;
    private total: number;
    private tax: number;
    private itemCount: number;

    constructor (id: string) {
        this.id = id;
        this.products = new Array<Product>();
        this.total = 0;
        this.tax = 0;
        this.itemCount = 0;
    }

    public getId (): string {
        return this.id;
    }
    
    public getTotal (): number {
        return this.total;
    }

    public getTaxes (): number {
        return this.tax;
    }

    public getProducts (): Array<Product> {
        return this.products;
    }

    public getItemCount (): number {
        return this.itemCount;
    }
    
    public addProduct (product: Product): void{
        this.itemCount += product.getQuantity();
        this.total += CartWithDetails.precisionRound(product.getTotalPrice(), 2);
        this.tax += 
            CartWithDetails.precisionRound(product.getTotalPrice() * product.getTax()/100, 2);
        this.total = CartWithDetails.precisionRound(this.total, 2);
        this.tax = CartWithDetails.precisionRound(this.tax, 2);
        this.products.push(product);
    }

    private static precisionRound (number: number, precision: number): number {
        if (precision < 0) {
            const FACTOR = Math.pow(10, precision);
            return Math.round(number * FACTOR) / FACTOR;
        }
        else{
            return +(Math.round(Number(number + "e+" + precision)) +
            "e-" + precision);
        }
    }
}