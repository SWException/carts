import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";
import * as AWS from "aws-sdk";

export class Dynamo implements Persistence {

    private static readonly TABLE_CARTS = "carts";
    private DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });

    public async getItem (userid: string): Promise<Cart> {
        const PARAMS = {
            Key: {
                id: userid
            },
            TableName: Dynamo.TABLE_CARTS
        };

        const DATA = await this.DOCUMENT_CLIENT.get(PARAMS).promise();
        console.log("getItem Dynamo: ", JSON.stringify(DATA.Item));

        const PROD: Map<string, number> = new Map<string, number>();
        
        DATA.Item?.products?.forEach(product => {
            PROD[product.productId] = product.quantity;
        });

        return DATA.Item ? new Cart(DATA.Item.id, PROD) : null;
    }

    public async deleteCart (userid: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: userid
            },
            TableName: Dynamo.TABLE_CARTS
        };

        await this.DOCUMENT_CLIENT.delete(PARAMS).promise().catch(
            () => { return false; }
        );
        return true;     
    }

    public async updateCart (cart: Cart): Promise<boolean> {
        const PRODUCTS: Map<string, number> = cart.getProducts();
        const VALUE: Array<any> = new Array<any>();
        console.log("PRODUCTS update dynamo:", PRODUCTS);
        
        Object.keys(PRODUCTS).forEach((key) => {
            VALUE.push({
                "productId": key,
                "quantity": PRODUCTS[key]
            });
        });
        console.log("Value update dynamo: ", VALUE);

        const PARAMS = {
            TableName: Dynamo.TABLE_CARTS,
            Item: {
                id: cart.getId(),
                products: VALUE
            }
        }
        console.log(JSON.stringify(PARAMS));

        const DATA = await this.DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => { return false; }
        );

        return DATA ? true : false;
    }
}