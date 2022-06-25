import { SendEmailCommand, SendEmailRequest, SendRawEmailCommandOutput, SES, SESClient } from "@aws-sdk/client-ses";

export type Message = {
    sender: string;
    recipient: string;
    body: string;
}

export async function forwardMessage(message: Message) {
    const region = process.env.AWS_REGION

    const sesClient = new SES({ region: region })
    const params = {
        Source: message.sender,
        Destination: { ToAddresses: [message.recipient] },
        RawMessage: message.body
    }

    let response: SendRawEmailCommandOutput | undefined = undefined

    try {
        response = await sesClient.sendRawEmail({
            Source: message.sender,
            Destinations: [message.recipient],
            RawMessage: {
                Data: Buffer.from(message.body)
            }
        })
    } catch (e) {
        console.error("Failed to send email")
        console.log(e)
    }

    console.log("Forwarded email successfully")
    console.log(response)
}