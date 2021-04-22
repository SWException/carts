import { Product } from "./product";

export class CartWithDetails {
    private readonly id: string;
    private readonly products: Array<Product>;
    private total: number;
    private tax: number;

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
        this.total= product.getPrice();
        this.tax += product.getPrice() * product.getTax()/100;
        this.products.push(product);
    }
}