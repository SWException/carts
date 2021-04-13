import { Persistence } from "../repository/persistence";
import { Products } from "../repository/products";
import { Users } from "../repository/users";
import { Dynamo } from "../repository/dynamo";
import { DbMock } from "../repository/dbMock";
import { ProductsMock } from "../repository/productsMock";
import { ProductsService } from "../repository/productsService";
import { UsersService } from "../repository/usersService";
import { UsersMock } from "../repository/usersMock";
import { Cart } from "./cart";

export class Model {
    private readonly persistence: Persistence;
    private readonly productsService: Products;
    private readonly usersService: Users;

    private constructor (persistence: Persistence, productsService: Products, usersService: Users) {
        this.persistence = persistence;
        this.productsService = productsService;
        this.usersService = usersService;
    }

    public static createModel (): Model {
        return new Model(new Dynamo(), new ProductsService(), new UsersService());
    }
    public static createModelTest (): Model {
        return new Model(new DbMock(), new ProductsMock(), new UsersMock());
    }

    public async getCart (token: string): Promise<JSON>{
        const ID: string = await this.tokenToID(token);
        if(ID == null)
            return null;
        const CART: Cart = this.persistence.getCart(ID);
        const PRODUCTS: Map<string, number> = CART.getProducts();
        const OBJ = {};
        let i = 0, total = 0, taxes = 0;
        PRODUCTS.forEach((quantity, productId) => {
            const PRODUCT = this.productsService.getProductInfo(productId);
            const TAX = PRODUCT["price"]*PRODUCT["tax"]/100;
            const PRICE = PRODUCT["price"] + TAX;
            total += PRICE;
            taxes += TAX;
            OBJ["products"][i++] = {
                "id": productId,
                "name": PRODUCT["name"],
                "primaryPhoto": PRODUCT["images"][0],
                "price": PRICE,
                "quantity": quantity
            };
        });
        OBJ["total"] = total;
        OBJ["tax"] = taxes;
        OBJ["id"] = ID;
        return JSON.parse(JSON.stringify(OBJ));
    }
    public async deleteCart (token: string): Promise<boolean> {
        const ID: string = await this.tokenToID(token);
        if(ID == null)
            return false;
        return this.persistence.deleteCart(ID);
    }
    public async addToCart (token: string, productId: string, quantity: number): Promise<boolean> {
        const CART_ID: string = await this.tokenToID(token);
        if(CART_ID == null)
            return false;
        return this.persistence.addToCart(CART_ID, productId, quantity);
    }
    public async removeFromCart (token: string, productId: string): Promise<boolean> {
        const CART_ID: string = await this.tokenToID(token);
        if(CART_ID == null)
            return false;
        return this.persistence.removeFromCart(CART_ID, productId);
    }

    private async tokenToID (token: string): Promise<string>{
        return await this.usersService.getUsername(token);
    }

}