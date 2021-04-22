import { Persistence } from "src/repository/persistence";
import { Products } from "src/repository/products";
import { Users } from "src/repository/users";
import { Dynamo } from "src/repository/dynamo";
import { DbMock } from "src/repository/dbMock";
import { ProductsMock } from "src/repository/productsMock";
import { ProductsService } from "src/repository/productsService";
import { UsersService } from "src/repository/usersService";
import { UsersMock } from "src/repository/usersMock";
import { Cart } from "./cart";
import { CartWithDetails } from "./cartWithDetails";
import { Product } from "./product";

export class Model {
    private readonly persistence: Persistence;
    private readonly productsService: Products;
    private readonly usersService: Users;

    private constructor (persistence: Persistence, productsService: Products, usersService: Users) {
        this.persistence = persistence;
        this.productsService = productsService;
        this.usersService = usersService;
    }

    private async getCartFromPersistence (token: string): Promise<Cart>{
        const ID: string = await this.tokenToID(token);
        if(ID == null)
            return null;
        const CART: Cart = await this.persistence.getItem(ID);
        return CART;
    }

    public static createModel (): Model {
        return new Model(new Dynamo(), new ProductsService(), new UsersService());
    }
    
    public static createModelTest (): Model {
        return new Model(new DbMock(), new ProductsMock(), new UsersMock());
    }

    public async getCart (token: string): Promise<CartWithDetails>{
        const CART: Cart = await this.getCartFromPersistence(token);
        console.log("getCart CART: ", CART);
        
        if(CART == null)
            return null;
        const PRODUCTS: Map<string, number> = CART.getProducts();

        console.log(PRODUCTS);
        const ARRAY_PROMISE: Array<Promise<any>> = new Array<Promise<any>>();
        Object.keys(PRODUCTS).forEach(key => {
            console.log("sto iterando");
            ARRAY_PROMISE.push(this.productsService.getProductInfo(key));
        });
        console.log("getCart model ARRAY_PROMISE: ", ARRAY_PROMISE);

        const ARRAY_TMP: Array<any> = await Promise.all(ARRAY_PROMISE);

        console.log("getCart model ARRAY_PROMISE after await: ", ARRAY_PROMISE);
        console.log("getCart model ARRAY_TMP: ", ARRAY_TMP);

        const CART_EXPANDED: CartWithDetails = new CartWithDetails(CART.getId());
        ARRAY_TMP.forEach((item) => {
            const PRODUCT: Product = new Product(item["id"], item["name"], item["primaryPhoto"],
                item["price"], item["tax"], item["quantity"]);
            CART_EXPANDED.addProduct(PRODUCT);
        });

        return CART_EXPANDED;
    }

    public async deleteCart (token: string): Promise<boolean> {
        const ID: string = await this.tokenToID(token);
        if(ID == null)
            return false;
        return this.persistence.deleteCart(ID);
    }

    public async addToCart (token: string, productId: string, quantity: number): Promise<boolean> {
        const CART: Cart = await this.getCartFromPersistence(token);
        if(CART == null) {
            const CART_NEW: Cart = new Cart(await this.tokenToID(token), new Map<string, number>());
            CART_NEW.addToCart(productId, quantity);
            return this.persistence.updateCart(CART_NEW);
        }
        else{
            CART.addToCart(productId, quantity);
            return this.persistence.updateCart(CART);
        }
    }

    public async removeFromCart (token: string, productId: string): Promise<boolean> {
        const CART: Cart = await this.getCartFromPersistence(token);
        if(CART == null)
            return false;
        CART.removeFromCart(productId);
        return this.persistence.updateCart(CART);
    }

    private async tokenToID (token: string): Promise<string>{
        return await this.usersService.getUsername(token);
    }
}