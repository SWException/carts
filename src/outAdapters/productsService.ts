import { Products } from "../core/outPorts/products";

export class ProductsService implements Products{
    getProductInfo(): JSON {
        // TO-DO chiamata a microservizio products
        return null;
    }

}