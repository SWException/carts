import { Products } from "./products";

export class ProductsService implements Products{
    getProductInfo (id: string): JSON {
        // TO-DO chiamata a microservizio products
        return null;
    }

}