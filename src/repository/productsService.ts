import fetch from "node-fetch";
import { Products } from "./products";

export class ProductsService implements Products{
    public async getProductInfo (PRODUCT_ID: string): Promise<any> {
        // TODO chiamata a microservizio products
        return await fetch(process.env.SERVICES + `/products/${PRODUCT_ID}`)
        .then(async responseProduct => await responseProduct.json())
        .then(res => {
            if (res.status == "success")
                return res.data;
            throw new Error((res?.message)? res.message : "Products error");
        })
        .catch((err: Error) => {
            throw new Error("Error fetching product " + PRODUCT_ID + ". Details: " + err.message);
        })
    }

}