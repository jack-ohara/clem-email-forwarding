import { SESEvent } from "aws-lambda";
import getMessageFromS3 from "./get-email-from-s3";

export async function handler(event: SESEvent) {
    console.log(JSON.stringify(event))

    const messageId = event.Records[0].ses.mail.messageId

    const message = await getMessageFromS3(messageId)

    console.log(message)

    return {
        statusCode: 200
    }
}