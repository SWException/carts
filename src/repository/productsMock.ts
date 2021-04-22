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
        stock: 100,
        primaryPhoto: "https://www.google.it",
        quantity: 1
    };

    getProductInfo (id: string): Promise<any> {
        if(id)
            return JSON.parse(JSON.stringify(ProductsMock.PRODUCT));
        return null;
    }

}