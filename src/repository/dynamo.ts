import { Category } from "src/core/category";
import { Persistence } from "src/repository/persistence";
import * as AWS from "aws-sdk";

export class Dynamo implements Persistence {

    private static readonly TABLE_TAXES = "taxes";
    private DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });

    public async getAll (): Promise<Array<Category>> {
        const PARAMS = {
            TableName: Dynamo.TABLE_TAXES
        };

        const DATA = await this.DOCUMENT_CLIENT.scan(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        const TAXES = new Array<Category>();
        DATA.Items.forEach(element => {
            TAXES.push(new Tax(element.id, element.value, element.description));
        });

        return TAXES ;
    } 

    public async getItem (id: string): Promise<Category> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_TAXES,
            IndexName: "id-index"
        };

        const DATA = await this.DOCUMENT_CLIENT.get(PARAMS).promise();
        return DATA.Item? new Tax(DATA.Item.id, DATA.Item.value, DATA.Item.description) : null;
    }

    public async addItem (item: Tax): Promise<boolean> {
        const PARAMS = {
            TableName: Dynamo.TABLE_TAXES,
            Key: {
                id: item.getID()
            },
            Item: item
        };

       const DATA =  this.DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => {return false; }
       );

       return (DATA) ? true : false;

    }

    public async editItem (item: Tax): Promise<boolean> {
        const VALUES = {};
        let expression = "SET ";
        let first = true;

        Object.keys(item).forEach(function (key) {
            if (key != "id") {
                const VALUE = item[key];
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
            TableName: Dynamo.TABLE_TAXES,
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

    public async deleteItem (id: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_TAXES,
            IndexName: "id-index"
        };

       await this.DOCUMENT_CLIENT.delete(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return true;;      
    }
}

 