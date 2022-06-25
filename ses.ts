import { SendEmailCommandInput, SendRawEmailCommandOutput, SES } from "@aws-sdk/client-ses";

export type Message = {
    sender: string;
    recipient: string;
    body: string;
}

export async function forwardMessage(input: SendEmailCommandInput) {
    const region = process.env.AWS_REGION

    const sesClient = new SES({ region: region })

    let response: SendRawEmailCommandOutput | undefined = undefined

    try {
        response = await sesClient.sendEmail(input)
    } catch (e) {
        console.error("Failed to send email")
        console.log(e)
    }

    console.log("Forwarded email successfully")
    console.log(response)
}