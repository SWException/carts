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
    await MODEL.addToCart("1", "1", 2);
    const RES = await MODEL.getCart("1");
    expect(RES).toMatchSchema(CART_SCHEMA);
});

test("deleteCart", async () => {
    const RES = await MODEL.deleteCart("1");
    expect(RES).toBe(true);
});

test("addToCart", async () => {
    let res = await MODEL.addToCart("1", "1", 2);
    expect(res).toBe(true);
    res = await MODEL.addToCart("1", "1", 1);
    expect(res).toBe(true);

});

test("removeFromCart", async () => {
    const RES = await MODEL.removeFromCart("1", "1");
    expect(RES).toBe(true);
});

test("error getCart", async () => {
    await expect(MODEL.getCart(null)).rejects.toThrow(Error);
});

test("error deleteCart", async () => {
    await expect(MODEL.deleteCart(null)).rejects.toThrow(Error);
});

test("error addToCart", async () => {
    await expect(MODEL.addToCart(null, "1", 2)).rejects.toThrow(Error);
});

test("error removeFromCart", async () => {
    await expect(MODEL.removeFromCart(null, "1")).rejects.toThrow(Error);
});