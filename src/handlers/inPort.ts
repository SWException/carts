export interface InPort {
    getCart(id: string): JSON;
    deleteCart(id: string): boolean;
    addToCart(cartId: string, productId: string, quantity: number): boolean;
    removeFromCart(cartId: string, productId: string): boolean;
}