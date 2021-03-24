import { DYNAMO } from "src/utils/Dynamo";
// import List from 'typescript.list';

import { buildAjv } from 'src/utils/configAjv';
import Ajv from "ajv"
const AJV: Ajv = buildAjv();

export default class Product {
    private static readonly TABLE = "products";

    // CAMPI DATI
    private readonly id: string;
    private readonly name: string;
    private readonly price: number;
    private readonly netPrice: number;
    private readonly tax: number;

    // INTERFACCIA PUBBLICA
    public getJson (): JSON {
        const JSON_TMP = {
            id: this.id,
            name: this.name,
            price: this.price,
            netPrice: this.netPrice,
            tax: this.tax
        };
        return JSON.parse(JSON.stringify(JSON_TMP));
    }

    public static async buildProduct (id: string): Promise<Product> {
        const PRODUCT_JSON: JSON = 
            await DYNAMO.getIndexPartition(Product.TABLE, "id-index", "id", id, null) as JSON;
        if (PRODUCT_JSON == null) {
            console.log("Product " + id + " not found");
            return null;
        }
        console.log("Product " + id + ": " + JSON.stringify(PRODUCT_JSON));

        return new Product(PRODUCT_JSON[0].id, PRODUCT_JSON[0].name,
            PRODUCT_JSON[0].netPrice, PRODUCT_JSON[0].tax);
    }

    public static async createNewProduct (data: { [key: string]: any }):
    Promise<boolean>{

        const VALID = AJV.validate("src/products/schema.json#/insertProduct", data);
        if (VALID) {
            const PRODUCT = await DYNAMO.write(Product.TABLE, data);
            return PRODUCT;
        }
        else {
            // i dati in ingresso per creare l'oggetto non rispettano lo json-schema
            return false;
        }
    }

    public static async updateProduct (PRODUCT_ID: string, DATA: JSON):
    Promise<boolean>{
        const VALID = AJV.validate("src/products/schema.json#/editProduct", DATA);
        if (VALID) {
            const PRODUCT = await DYNAMO.update(Product.TABLE, PRODUCT_ID, DATA);
            return PRODUCT;
        }
        else {
            // i dati in ingresso per modificare l'oggetto non rispettano lo json-schema
            return false;
        }
    }

    // TODO: per ora ho fatto una cosa semplice,
    //poi è il caso di creare tanti Product e ritornare Array<Product>?
    public static async buildAllProduct (DATA: JSON){
        console.log(DATA); //dati per filtrare e ordinare
        // TODO: Da aggiungere i filtri e ordinamento appena ci sarà il metodo disponibile in Dynamodb.ts
        const PRODUCT = await DYNAMO.getScan(Product.TABLE);
        return PRODUCT;
    }

    // METODI PRIVATI
    private constructor (id: string, name: string,
        netPrice: number, tax: number) {
        
        this.id = id;
        this.name = name;
        this.netPrice = netPrice;
        this.tax = tax;
        this.price = this.calculatePrice();
    }

    private calculatePrice (){
        return this.netPrice * (this.tax / 100 + 1)
    }
}
