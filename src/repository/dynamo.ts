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
        
        DATA.Item.products.forEach(product => {
            PROD[product.id] = product.quantity;
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
            (err) => { return err; }
        );
        return true;     
    }

    public async updateCart (cart: Cart): Promise<boolean> {
        const VALUES = {};
        let expression = "SET ";
        let first = true;

        Object.keys(cart).forEach(function (key) {
            if (key != "id") {
                const VALUE = cart[key];
                if (!first) {
                    expression += ", "
                } 
                else {
                    first = false;
                }
                expression += key + " = :" + key;
                VALUES[":" + key] = VALUE;
            }
        });

        const PARAMS = {
            TableName: Dynamo.TABLE_CARTS,
            Key: {
                id: cart.getId()
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: VALUES
        }
        console.log(PARAMS);

        const DATA = await this.DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            () => { return false; }
        );
        return DATA ? true : false;
    }
}