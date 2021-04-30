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
import {v4 as uuidv4} from 'uuid';

export class Model {
    private readonly persistence: Persistence;
    private readonly productsService: Products;
    private readonly usersService: Users;

    private constructor (persistence: Persistence, productsService: Products, usersService: Users) {
        this.persistence = persistence;
        this.productsService = productsService;
        this.usersService = usersService;
    }

    private async getCartFromPersistence (token: string, isGuest: boolean): Promise<Cart>{
        const ID: string = isGuest ? token : await this.tokenToID(token);
        const CART: Cart = await this.persistence.getItem(ID);

        if(!CART){
            if(isGuest) return new Cart(this.generateGuestId());
                else return new Cart(ID); 
        } 
        else return CART;
    }

    public static createModel (): Model {
        return new Model(new Dynamo(), new ProductsService(), new UsersService());
    }
    
    public static createModelTest (): Model {
        return new Model(new DbMock(), new ProductsMock(), new UsersMock());
    }

    public async getCart (token: string, isGuest: boolean): 
        Promise<{cart: CartWithDetails, modified: boolean}>{

        let cart: Cart = await this.getCartFromPersistence(token, isGuest);
       
        const PRODUCTS: Map<string, number> = cart.getProducts();

        const ARRAY_PROMISE: Array<Promise<any>> = new Array<Promise<any>>();
        Object.keys(PRODUCTS).forEach(key => {
            ARRAY_PROMISE.push(this.productsService.getProductInfo(key));
        });
        
        const ARRAY_TMP: Array<any> = await Promise.all(ARRAY_PROMISE);

        const CART_EXPANDED: CartWithDetails = new CartWithDetails(cart.getId());
        let flagModified = false;
       
        ARRAY_TMP.forEach((item) => {
           if(item.stock >= PRODUCTS[item.id]) { // check quantity
                const PRODUCT: Product = new Product(item.id, item.name, item.primaryPhoto,
                    item.price,item.tax, PRODUCTS[item.id]);
                CART_EXPANDED.addProduct(PRODUCT);
            }
            else {
                if(item.stock > 0){
                    const PRODUCT: Product = new Product(item.id, item.name, item.primaryPhoto,
                        item.price,item.tax, item.stock);
                    CART_EXPANDED.addProduct(PRODUCT);
                    cart.updateCart(item.id, item.stock);
                }   
                else
                    cart.removeFromCart(item.id);

                flagModified = true;
            }
        });
        if(flagModified) 
            await this.persistence.updateCart(cart);
        return {
            cart: CART_EXPANDED,
            modified: flagModified
        };
    }

    public async deleteCart (token: string, isGuest: boolean): Promise<boolean> {
        const ID: string = isGuest ? token : await this.tokenToID(token);
        return this.persistence.deleteCart(ID);
    }

    public async addToCart (token: string, productId: string, quantity: number,
        isGuest: boolean): Promise<boolean> {

        const CART: Cart = await this.getCartFromPersistence(token, isGuest);

            console.log("Updating cart");
            const AVAILABLE: boolean = await this.productsService.checkQuantity(productId,
                quantity+CART.getQuantity(productId));
            if(!AVAILABLE)
                return false;
            CART.addToCart(productId, quantity);
            return this.persistence.updateCart(CART);
        
    }

    public async updateCart (token: string, productId: string, quantity: number,
        isGuest: boolean): Promise<boolean> {
        // Uguale ad addToCart, ma non somma la quantità a quella esistente, la sostituisce
        const CART: Cart = await this.getCartFromPersistence(token, isGuest);
        console.log("cart: ", CART);
        console.log("NEW QUANTITY: ", quantity);
        
        const AVAILABLE: boolean = await this.productsService.checkQuantity(productId, quantity);
        if(!AVAILABLE)
            return false;

        console.log("Updating cart in updateCart");
        CART.updateCart(productId, quantity); // Questa è una riga diversa da add to cart
        return this.persistence.updateCart(CART);
        
    }

    public async removeFromCart (token: string, productId: string,
        isGuest: boolean): Promise<boolean> {
        const CART: Cart = await this.getCartFromPersistence(token, isGuest);
        if(CART.contains(productId)) {
            CART.removeFromCart(productId);
            return this.persistence.updateCart(CART);
        }
        return true;
    }

    public async authCart (customerToken: string, guestToken: string): Promise<boolean> {
        const CART_GUEST: Cart = await this.persistence.getItem(guestToken);
        const PRODUCTS: Map<string, number> = CART_GUEST.getProducts();
        const USERNAME: string = await this.tokenToID(customerToken);
        const CART_CUSTOMER: Cart = await this.persistence.getItem(USERNAME);
        if(CART_CUSTOMER) { // merge con un eventuale carrello già presente per quell'utente
            const PRODUCTS_CUSTOMER: Map<string, number> = CART_CUSTOMER.getProducts();
            Object.keys(PRODUCTS_CUSTOMER).forEach(key => {
                const TMP: number = (PRODUCTS[key] ? PRODUCTS[key] : 0) + PRODUCTS_CUSTOMER[key];
                PRODUCTS.set(key, TMP);
            });
        }
        const CART_NEW = new Cart(USERNAME, PRODUCTS);
        const DELETE: boolean = await this.persistence.deleteCart(guestToken);
        if(!DELETE)
            return false;
        return await this.persistence.updateCart(CART_NEW);
    }

    private async tokenToID (token: string): Promise<string>{
        const ID: string = await this.usersService.getUsername(token);
        if(ID == null)
            throw new Error("invalid token");
        return ID;
    }

    private generateGuestId (): string {
        return "guest_"+uuidv4();
    }
}