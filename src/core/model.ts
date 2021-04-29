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
        const CART: Cart = await this.persistence.getItem(ID);
        return CART ? CART : new Cart(ID);
    }

    public static createModel (): Model {
        return new Model(new Dynamo(), new ProductsService(), new UsersService());
    }
    
    public static createModelTest (): Model {
        return new Model(new DbMock(), new ProductsMock(), new UsersMock());
    }

    public async getCart (token: string): Promise<CartWithDetails>{
        const CART: Cart = await this.getCartFromPersistence(token);

        const PRODUCTS: Map<string, number> = CART.getProducts();

        console.log(PRODUCTS);
        const ARRAY_PROMISE: Array<Promise<any>> = new Array<Promise<any>>();
        Object.keys(PRODUCTS).forEach(key => {
            ARRAY_PROMISE.push(this.productsService.getProductInfo(key));
        });

        const ARRAY_TMP: Array<any> = await Promise.all(ARRAY_PROMISE);

        const CART_EXPANDED: CartWithDetails = new CartWithDetails(CART.getId());
        ARRAY_TMP.forEach((item) => {
            const PRODUCT: Product = new Product(item["id"], item["name"], item["primaryPhoto"],
                item["price"], item["tax"], PRODUCTS[item["id"]]);
            CART_EXPANDED.addProduct(PRODUCT);
        });
        
        return CART_EXPANDED;
    }

    public async deleteCart (token: string): Promise<boolean> {
        const ID: string = await this.tokenToID(token);
        return this.persistence.deleteCart(ID);
    }

    public async addToCart (token: string, productId: string, quantity: number): Promise<boolean> {
        const CART: Cart = await this.getCartFromPersistence(token).catch((err) => {
            console.log(err.message);
            return null;
        });
        console.log("CART: ", CART);
        
        if(CART == null) {
            console.log("Creating new cart");
            const AVAILABLE: boolean = 
                await this.productsService.checkQuantity(productId, quantity);
            if(!AVAILABLE)
                return false;
            const CART_NEW: Cart = new Cart(await this.tokenToID(token), new Map<string, number>());
            CART_NEW.addToCart(productId, quantity);
            return this.persistence.updateCart(CART_NEW);
        }
        else{
            console.log("Updating cart");
            const AVAILABLE: boolean = await this.productsService.checkQuantity(productId,
                quantity+CART.getQuantity(productId));
            if(!AVAILABLE)
                return false;
            CART.addToCart(productId, quantity);
            return this.persistence.updateCart(CART);
        }
    }

    public async updateCart (token: string, productId: string, quantity: number): Promise<boolean> {
        // Uguale ad addToCart, ma non somma la quantità a quella esistente, la sostituisce
        const CART: Cart = await this.getCartFromPersistence(token).catch((err) => {
            console.log(err.message);
            return null;
        });
        console.log("CART: ", CART);
        console.log("NEW QUANTITY: ", quantity);
        
        const AVAILABLE: boolean = await this.productsService.checkQuantity(productId, quantity);
        if(!AVAILABLE)
            return false;

        if(CART == null) {
            console.log("Creating new cart in updateCart");
            const CART_NEW: Cart = new Cart(await this.tokenToID(token), new Map<string, number>());
            CART_NEW.updateCart(productId, quantity); // Questa è una riga diversa da add to cart
            return this.persistence.updateCart(CART_NEW);
        }
        else{
            console.log("Updating cart in updateCart");
            CART.updateCart(productId, quantity); // Questa è una riga diversa da add to cart
            return this.persistence.updateCart(CART);
        }
    }

    public async removeFromCart (token: string, productId: string): Promise<boolean> {
        const CART: Cart = await this.getCartFromPersistence(token);
        if(CART.contains(productId)) {
            CART.removeFromCart(productId);
            return this.persistence.updateCart(CART);
        }
        return true;
    }

    private async tokenToID (token: string): Promise<string>{
        const ID: string = await this.usersService.getUsername(token);
        if(ID == null)
            throw new Error("invalid token");
        return ID;
    }
}