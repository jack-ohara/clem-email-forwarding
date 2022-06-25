import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"

export default async function getMessageFromS3(messageId: string): Promise<string | undefined> {
    const bucketName = process.env.EMAIL_S3_BUCKET
    const emailS3Prefix = process.env.EMAIL_S3_PREFIX
    const region = process.env.AWS_REGION

    if (!bucketName) {
        throw new Error("No bucket name found")
    }

    if (!region) {
        throw new Error("No AWS region found")
    }

    const key = emailS3Prefix ? `${emailS3Prefix}/${messageId}` : messageId

    const s3Client = new S3Client({ region: region })
    const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: key })
    const s3Object = await s3Client.send(getObjectCommand)

    const file = s3Object.Body && await streamToString(s3Object.Body as Readable)

    return file
}

function streamToString (stream: Readable): Promise<string> {
    const chunks: Uint8Array[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
  }