import {
    PutObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Service {
    s3Client: S3Client;
    sqsClient: SQSClient;
    bucketName: string;

    constructor(region, bucketName) {
        this.s3Client = new S3Client({ region })
        this.sqsClient = new SQSClient({ region })
        this.bucketName = bucketName
    }

    async upload(fileName) {
        const params = {
            Bucket: this.bucketName,
            Key: `uploaded/${fileName}`,
            ContentType: 'text/csv',
        };

        const command = new PutObjectCommand(params);

        try {
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 180 });

            return url
        } catch (e) {
            console.error(e);
            throw e
        }
    }

    async parse(records) {
        try {
            for (const record of records) {
                const params = {
                    Bucket: this.bucketName,
                    Key: record.s3.object.key,
                };
                const copyObjectParams = {
                    Bucket: this.bucketName,
                    CopySource: `${this.bucketName}/${record.s3.object.key}`,
                    Key: record.s3.object.key.replace('uploaded', 'parsed'),
                };

                const copyObjectCommand = new CopyObjectCommand(copyObjectParams);
                const deleteObjectCommand = new DeleteObjectCommand(params);

                await this.s3Client.send(copyObjectCommand);
                await this.s3Client.send(deleteObjectCommand);
            }
        } catch (e) {
            console.error(e);
            throw e
        }
    }
}
