import { HANDLER } from "src/cart/postCart"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { mock } from 'jest-mock-extended';
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";

import { SCHEMAS, setFormats } from 'src/utils/configAjv';
expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const RESPONSE_SCHEMA: JSONSchema7 = {
    $ref: "src/utils/schema.json#/response"
};

test('response schema', () => {
    expect(RESPONSE_SCHEMA).toBeValidSchema();
});

test('400 Authorization fails', async () => {
    const EVENT: APIGatewayProxyEvent = mock<APIGatewayProxyEvent>();
    EVENT.headers.Authorization = "1";
    const RES = (await HANDLER(EVENT, null, null)) as APIGatewayProxyResult;
    RES.body = JSON.parse(RES.body);
    expect(RES.statusCode).toBe(400);
    expect(RES.body).toMatchSchema(RESPONSE_SCHEMA);
});

test('400 richiesta incompleta o errata', async () => {
    const EVENT: APIGatewayProxyEvent = mock<APIGatewayProxyEvent>();
    const RES = (await HANDLER(EVENT, null, null)) as APIGatewayProxyResult;
    RES.body = JSON.parse(RES.body);
    expect(RES.statusCode).toBe(400);
    expect(RES.body).toMatchSchema(RESPONSE_SCHEMA);
});

