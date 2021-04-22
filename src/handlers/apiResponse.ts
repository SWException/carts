import { APIGatewayProxyResult } from "aws-lambda";

export default function response (statusCode: number, 
    message?: string,
    data?: JSON): APIGatewayProxyResult {

    const BODY = {};
    if(statusCode>=300){
        BODY["status"] = "error";
    }else{
        BODY["status"] = "success";
    }
    if(message)
        BODY["message"] = message;
    if(data)
        BODY["data"] = data;
    
    return {
        "statusCode": statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Credentials': true
        },
        "body": JSON.stringify(BODY)
    }
}