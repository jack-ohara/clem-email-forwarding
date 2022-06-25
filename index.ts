import { SESEvent } from "aws-lambda";

export function handler(event: SESEvent) {
    console.log(event)

    console.log(event.Records[0].ses)

    return {
        statusCode: 200
    }
}