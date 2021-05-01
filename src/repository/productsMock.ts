import { Products } from "./products";

export class ProductsMock implements Products {
    private static readonly PRODUCT = {
        id: "test_product",
        name: "product mock",
        description: "this is a fake product",
        images: ["url1", "url2"],
        category: "cat1",
        price: 23.5,
        tax: 22,
        show: true,
        showHome: false,
        stock: 10,
        primaryPhoto: "https://www.google.it",
    };


    private static readonly PRODUCT2 = {
        id: "product_2",
        name: "product mock 2",
        description: "this is a fake product",
        images: ["url1", "url2"],
        category: "cat1",
        price: 23.5,
        tax: 22,
        show: true,
        showHome: false,
        stock: 10,
        primaryPhoto: "https://www.google.it",
    };

    private static readonly PRODUCT3 = {
        id: "product_3",
        name: "product mock 3 vuoto",
        description: "this is a fake product",
        images: ["url1", "url2"],
        category: "cat1",
        price: 23.5,
        tax: 22,
        show: true,
        showHome: false,
        stock: 0,
        primaryPhoto: "https://www.google.it",
    };

    public async getProductInfo (id: string): Promise<any> {
        if(id=="test_product")
            return ProductsMock.PRODUCT;
        if(id=="product_2")
            return ProductsMock.PRODUCT2
        if(id=="product_3")
            return ProductsMock.PRODUCT3
        return null;
    }

    public async checkQuantity (_id: string, _quantity: number): Promise<boolean> {
        if(_id = "test_product")
            if (ProductsMock.PRODUCT.stock >= _quantity) return true;
        else 
             if (ProductsMock.PRODUCT2.stock >= _quantity) return true;
             
        else return false;
    }
}
