import { Model } from "src/core/model";
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";
import { SCHEMAS, setFormats } from 'tests/configAjv';

expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const MODEL = Model.createModelTest();


const CART_SCHEMA: JSONSchema7 = {
    $ref: "schemas/carts.json#/cart"
};

test('schema', () => {
    expect(CART_SCHEMA).toBeValidSchema();
});

test('getCart', async () => {
    const RES = await MODEL.getCart("1", false);
    expect(RES.cart).toMatchSchema(CART_SCHEMA);
    const RESA = await MODEL.getCart("guest_1", false);
    expect(RESA.cart).toMatchSchema(CART_SCHEMA);
    const RES2 = await MODEL.getCart("guest_3", false);
    expect(RES2.cart).toMatchSchema(CART_SCHEMA);
    const RES3 = await MODEL.getCart("100", false);
    expect(RES3.cart).toMatchSchema(CART_SCHEMA);
});

test('getCart qta non disponibile', async () => {
    const RES = await MODEL.getCart("guest_1", false);
    expect(RES.cart).toMatchSchema(CART_SCHEMA);
   
});

test('test real Model', async () => {
    const MODEL = Model.createModel();
    expect(typeof MODEL).toBe("object"); 
});

test('getCart guest', async () => {
    const RES4 = await MODEL.getCart(null, true);
    expect(RES4.cart).toMatchSchema(CART_SCHEMA);
    const RES5 = await MODEL.getCart("1", true);
    expect(RES5.cart).toMatchSchema(CART_SCHEMA);
});

test('getCart with error stock', async () => {
    const RES = await MODEL.getCart("1", false);
    expect(RES.cart).toMatchSchema(CART_SCHEMA);
});

test("addToCart", async () => {
    const RES = await MODEL.addToCart("1", "test_product", 1, false);
    expect(RES).toBe(true);
});

test("addToCart no stock", async () => {
    await expect(MODEL.addToCart("1", "test_product", 20, false))
        .rejects
        .toThrowError();
});

test("addToCart no cart ID", async () => {
    await expect(MODEL.addToCart(null, "1", 2, false))
        .rejects
        .toThrowError();
});

test('updateCart', async ()=>{
    const RES = await MODEL.updateCart("1","test_product",2,false);
    expect(RES).toBe(true);
});

test('updateCart error', async ()=>{
    await expect(MODEL.updateCart("1","test_product",50,false))
        .rejects
        .toThrowError();
});

test("deleteCart", async () => {
    const RES = await MODEL.deleteCart("1", false);
    expect(RES).toBe(true);
});


test("deleteCart guest", async () => {
    const RES = await MODEL.deleteCart("guest_1", true);
    expect(RES).toBe(true);
});

test("removeFromCart", async () => { // da sistemare, errore tipo boolean
    const RES  = await MODEL.removeFromCart("guest_1", "test_product", false);
    expect(RES).toBe(true);
});

test("removeFromCart prodotto non in carrello", async () => { // da sistemare, errore tipo boolean
    const RES  = await MODEL.removeFromCart("guest_1", "prodotto_fantasma", false);
    expect(RES).toBe(true);
});

test("authCart", async () => {
    const RES = await MODEL.authCart("1", "guest_1");
    expect(RES).toBe(true);
});

test("authCart invalid guest", async () => {
    const RES = await MODEL.authCart("1", "guest_invalid");
    expect(RES).toBe(false);
});

test("error deleteCart", async () => {
    await expect(MODEL.deleteCart(null, false)).rejects.toThrow(Error);
});

test("error addToCart", async () => {
    await expect(MODEL.addToCart(null, "1", 2, false)).rejects.toThrow(Error);
});

test("error removeFromCart", async () => {
    await expect(MODEL.removeFromCart(null, "1", false)).rejects.toThrow(Error);
});
