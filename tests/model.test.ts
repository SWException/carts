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
    const RES2 = await MODEL.getCart("guest_3", false);
    expect(RES2.cart).toMatchSchema(CART_SCHEMA);
    const RES3 = await MODEL.getCart("100", false);
    expect(RES3.cart).toMatchSchema(CART_SCHEMA);
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
    let res = await MODEL.addToCart("1", "test_product", 1, false);
    expect(res).toBe(true);
    res = await MODEL.addToCart("1", "test_product", 20, false);
    expect(res).toBe(false);
    await expect(MODEL.addToCart(null, "1", 2, false)).rejects.toThrow(Error);
});

test('updateToCart', async()=>{
    await MODEL.updateCart("1","1",2,false);
    const RES = await MODEL.getCart("1", false);
    expect(RES.cart).toMatchSchema(CART_SCHEMA);

});

test("deleteCart", async () => {
    const RES = await MODEL.deleteCart("1", false);
    expect(RES).toBe(true);
});

test("removeFromCart", async () => {
    const RES = await MODEL.removeFromCart("guest_1", "test_product", false);
    expect(RES).toBe(true);
});

test("authCart", async () => {
    const RES = await MODEL.authCart("1", "guest_1");
    expect(RES).toBe(true);
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