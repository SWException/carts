export class Product{
    private readonly productId: string;
    private readonly name: string;
    private readonly primaryPhoto: string;
    private readonly price: number;
    private readonly tax: number;
    private readonly quantity: number;
    private readonly total: number;

    constructor (productId: string, name: string, primaryPhoto: string, 
        price: number, tax: number, quantity: number) {
        this.productId = productId;
        this.name = name;
        this.primaryPhoto = primaryPhoto;
        this.price = price;
        this.tax = tax;
        this.quantity = quantity;
        this.total = price * quantity;
    }

    //metodi mai usati ma creati solo per evitare errore di mancato utilizzo dato
    public getId(): string {
        return this.productId;
    }

    public getName(): string {
        return this.name;
    }

    public getPrimaryPhoto(): string {
        return this.primaryPhoto;
    }

    public getPrice(): number {
        return this.price;
    }

    public getTotalPrice(): number {
        return this.total;
    }

    public getTax(): number {
        return this.tax;
    }

    public getQuantity(): number {
        return this.quantity;
    }
}