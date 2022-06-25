import { SESEvent } from "aws-lambda";
import { constructMessage } from "./construct-message";
import getMessageFromS3 from "./get-email-from-s3";
import { forwardMessage } from "./ses";

export async function handler(event: SESEvent) {
    console.log(JSON.stringify(event))

    const messageId = event.Records[0].ses.mail.messageId

    const emailFile = await getMessageFromS3(messageId)

    if (!emailFile) {
        throw new Error("No email file found")
    }

    const message = await constructMessage(emailFile)

    console.log('Constructed message: ', message)

    // await forwardMessage({ recipient: "jack@jackohara.io", sender: "test@johtest.link", body: message })

    return {
        statusCode: 200
    }
}