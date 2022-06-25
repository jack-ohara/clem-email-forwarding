import { SESEvent } from "aws-lambda";
import getMessageFromS3 from "./get-email-from-s3";
import { forwardMessage } from "./ses";

export async function handler(event: SESEvent) {
    console.log(JSON.stringify(event))

    const messageId = event.Records[0].ses.mail.messageId

    const message = await getMessageFromS3(messageId)

    if (!message) {
        throw new Error("No message found")
    }

    await forwardMessage({ recipient: "jack@jackohara.io", sender: "test@johtest.link", body: message })

    return {
        statusCode: 200
    }
}