import { APIGatewayProxyResult } from "aws-lambda";

export default function response (statusCode: number, 
    message?: string,
    data?: { [key: string]: any }): APIGatewayProxyResult {
    const BODY = {
        status: (statusCode >= 400? "error" : "success")
    };
    if(message)
        BODY["message"] = message;
    if(data)
        BODY["data"] = data;
    
    return {
        "statusCode": statusCode,
        "headers": {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
            'Access-Control-Allow-Headers': '*'
        },
        "body": JSON.stringify(BODY)
    }
}