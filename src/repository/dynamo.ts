import { Cart } from "src/core/cart";
import { Persistence } from "./persistence";
import * as AWS from "aws-sdk";

export class Dynamo implements Persistence {

    private static readonly TABLE_CARTS = "carts";
    private DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });


    public async getItem (id: string): Promise<Cart> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_CARTS,
            IndexName: "id-index"
        };

        const DATA = await this.DOCUMENT_CLIENT.get(PARAMS).promise();
        return DATA.Item? new Cart(DATA.Item.id, DATA.Item.products) : null;
    }
    public async deleteCart (id: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_CARTS,
            IndexName: "id-index"
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
                id: item.getID()
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: VALUES
        }
        console.log(PARAMS);

        const DATA = await this.DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return DATA;
    }


}