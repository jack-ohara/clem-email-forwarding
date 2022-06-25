import { Body, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { simpleParser } from "mailparser";

const destinationEmailAddressMap: {
    [key: string]: string
} = {
    "signups@johtest.link": "signups@jackohara.io",
    "jack@johtest.link": "jack@jackohara.io"
}

export async function constructMessage(email: string): Promise<SendEmailCommandInput> {
    const parsedEmail = await simpleParser(email)

    const destinationAddresses = Array.isArray(parsedEmail.to) ?
        parsedEmail.to.map(x => getDestinationAddress(x.value[0].address)) :
        [getDestinationAddress(parsedEmail.to?.value[0].address)]

    const body: Body = parsedEmail.html ? {
        Html: { Data: parsedEmail.html }
    } : {
        Text: { Data: parsedEmail.text }
    }
    
    return {
        Source: parsedEmail.from?.value[0].address,
        Destination: { ToAddresses: destinationAddresses },
        Message: {
            Subject: { Data: `Original subject: ${parsedEmail.subject}` },
            Body: body
        }
    }
}

function getDestinationAddress(originalDestination: string | undefined): string {
    if (!originalDestination) {
        throw new Error("Original destination address cannot be empty")
    }

    return destinationEmailAddressMap[originalDestination]
}