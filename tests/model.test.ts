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
    const RES = await MODEL.getCart(null);
    expect(RES).toBe(null);
});

test("error deleteCart", async () => {
    const RES = await MODEL.deleteCart(null);
    expect(RES).toBe(false);
});

test("error addToCart", async () => {
    const RES = await MODEL.addToCart(null, "1", 2);
    expect(RES).toBe(false);
});

test("error removeFromCart", async () => {
    const RES = await MODEL.removeFromCart(null, "1");
    expect(RES).toBe(false);
});