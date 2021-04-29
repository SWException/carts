export interface Products {
    getProductInfo(id: string): Promise<any>;
    checkQuantity(id: string, quantity: number): Promise<boolean>;
}