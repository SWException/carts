import { InPort } from "../../handlers/inPort";
import { Persistence } from "../outPorts/persistence";
import { Products } from "../outPorts/products";
import { Dynamo } from "../../outAdapters/dynamo";
import { DbMock } from "../../outAdapters/dbMock";
import { ProductsMock } from "../../outAdapters/productsMock";
import { ProductsService } from "../../outAdapters/productsService";
import { Cart } from "../cart";

export class Model implements InPort {
    private readonly persistence: Persistence;
    private readonly productsService: Products;

    private constructor (persistence: Persistence, productsService: Products) {
        this.persistence = persistence;
        this.productsService = productsService;
    }

    public static createModel () {
        return new Model(new Dynamo(), new ProductsService());
    }
    public static createModelPersistenceMock () {
        return new Model(new DbMock(), new ProductsService());
    }
    public static createModelProductsMock() {
        return new Model(new Dynamo(), new ProductsMock());
    }
    public static createModelProductsAndPersistenceMock() {
        return new Model(new DbMock(), new ProductsMock());
    }

    getCart (id: string): JSON {
        throw new Error("Method not implemented.");
    }
    deleteCart (id: string): boolean {
        throw new Error("Method not implemented.");
    }
    addToCart (cartId: string, productId: string, quantity: number): boolean {
        throw new Error("Method not implemented.");
    }
    removeFromCart (cartId: string, productId: string): boolean {
        throw new Error("Method not implemented.");
    }

}