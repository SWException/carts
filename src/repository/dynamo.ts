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
            PROD.set(product.id, product.quantity);
        });

        return DATA.Item ? new Cart(DATA.Item.id, PROD) : null;
    }

    public async deleteCart (userid: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: userid
            },
            TableName: Dynamo.TABLE_CARTS,
            ReturnValues: 'ALL_OLD',
        };

        
        const RESP = await this.DOCUMENT_CLIENT.delete(PARAMS).promise();
        if (!RESP.Attributes) {
            throw new Error('Cannot delete item that does not exist')
        }
        else 
            return true;     
    }

    public async updateCart (cart: Cart): Promise<boolean> {
        const PRODUCTS: Map<string, number> = cart.getProducts();
        const VALUE: Array<any> = new Array<any>();
        console.log("PRODUCTS update dynamo:", PRODUCTS);

        const KEYS = Array.from(PRODUCTS.keys())

        console.log({KEYS});
        
        KEYS.forEach((key) => {
            console.log("forEach PRODUCTS. Current key: ", key);
            
            VALUE.push({
                "id": key,
                "quantity": PRODUCTS.get(key)
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