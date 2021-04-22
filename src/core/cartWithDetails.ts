import { Product } from "./product";

export class CartWithDetails {
    private readonly id: string;
    private readonly products: Array<Product>;
    private total: number;
    private tax: number;
    private itemCount: number = 0;

    constructor (id: string) {
        this.id = id;
        this.products = new Array<Product>();
        this.total = 0;
        this.tax = 0;
    }

    public getId(): string {
        return this.id;
    }
    
    public getTotal(): number {
        return this.total;
    }

    public getTaxes(): number {
        return this.tax;
    }

    public getProducts(): Array<Product> {
        return this.products;
    }    
    
    public addProduct(product: Product): void{
        this.itemCount += product.getQuantity();
        this.total += product.getTotalPrice();
        this.tax += product.getTotalPrice() * product.getTax()/100;
        this.products.push(product);
    }
}