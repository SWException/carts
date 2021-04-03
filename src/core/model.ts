import { Persistence } from "../outAdapters/persistence";
import { Products } from "../outAdapters/products";
import { Dynamo } from "../outAdapters/dynamo";
import { DbMock } from "../outAdapters/dbMock";
import { ProductsMock } from "../outAdapters/productsMock";
import { ProductsService } from "../outAdapters/productsService";
import { Cart } from "./cart";

export class Model {
    private readonly persistence: Persistence;
    private readonly productsService: Products;

    private constructor (persistence: Persistence, productsService: Products) {
        this.persistence = persistence;
        this.productsService = productsService;
    }

    public static createModel (): Model {
        return new Model(new Dynamo(), new ProductsService());
    }
    public static createModelPersistenceMock (): Model {
        return new Model(new DbMock(), new ProductsService());
    }
    public static createModelProductsMock (): Model {
        return new Model(new Dynamo(), new ProductsMock());
    }
    public static createModelProductsAndPersistenceMock (): Model {
        return new Model(new DbMock(), new ProductsMock());
    }

    getCart (id: string): JSON{
        const CART: Cart = this.persistence.getCart(id);
        const PRODUCTS: Map<string, number> = CART.getProducts();
        const OBJ = {};
        let i = 0;
        PRODUCTS.forEach((quantity, productId) => {
            const PRODUCT = this.productsService.getProductInfo(productId);
            OBJ[i++] = {
                "id": productId,
                "name": PRODUCT["name"],
                "primaryPhoto": PRODUCT["images"][0],
                "price": 0,
                "quantity": quantity
            };
        });
        return JSON.parse(JSON.stringify(OBJ));
    }
    deleteCart (id: string): boolean {
        return this.persistence.deleteCart(id);
    }
    addToCart (cartId: string, productId: string, quantity: number): boolean {
        return this.persistence.addToCart(cartId, productId, quantity);
    }
    removeFromCart (cartId: string, productId: string): boolean {
        return this.persistence.removeFromCart(cartId, productId);
    }

}