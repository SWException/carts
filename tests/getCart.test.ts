import { HANDLER } from "src/getCart"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { mock } from 'jest-mock-extended';
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";

import { SCHEMAS, setFormats } from 'src/utils/configAjv';
expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const RESPONSE_CART_SCHEMA: JSONSchema7 = {
    $ref: "src/cart/schema.json#/responseCart"
};

test('response schema', () => {
    expect(RESPONSE_CART_SCHEMA).toBeValidSchema();
});

test('getCart 200 guestToken', async () => {
    const EVENT: APIGatewayProxyEvent = mock<APIGatewayProxyEvent>();
    EVENT.headers.guestToken = "1";
    const RES = (await HANDLER(EVENT, null, null)) as APIGatewayProxyResult;
    RES.body = JSON.parse(RES.body);
    expect(RES.statusCode).toBe(200);
    expect(RES.body).toMatchSchema(RESPONSE_CART_SCHEMA);
});

test('getCart 400 Authorization', async () => {
    const EVENT: APIGatewayProxyEvent = mock<APIGatewayProxyEvent>();
    EVENT.headers.Authorization = "1";
    const RES = (await HANDLER(EVENT, null, null)) as APIGatewayProxyResult;
    RES.body = JSON.parse(RES.body);
    expect(RES.statusCode).toBe(400);
    expect(RES.body).toMatchSchema(RESPONSE_CART_SCHEMA);
});

test('getCart 400 richiesta incompleta o errata', async () => {
    const EVENT: APIGatewayProxyEvent = mock<APIGatewayProxyEvent>();
    const RES = (await HANDLER(EVENT, null, null)) as APIGatewayProxyResult;
    RES.body = JSON.parse(RES.body);
    expect(RES.statusCode).toBe(400);
    expect(RES.body).toMatchSchema(RESPONSE_CART_SCHEMA);
});

test('getCart 400 carrello non presente', async () => {
    const EVENT: APIGatewayProxyEvent = mock<APIGatewayProxyEvent>();
    EVENT.headers.id = "0";
    const RES = (await HANDLER(EVENT, null, null)) as APIGatewayProxyResult;
    RES.body = JSON.parse(RES.body);
    expect(RES.statusCode).toBe(400);
    expect(RES.body).toMatchSchema(RESPONSE_CART_SCHEMA);
});
