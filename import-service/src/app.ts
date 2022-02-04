import { ResponseService } from '../../common/services/response.service';
import { S3Service } from './services/s3-service';

let app

export class App {
    private constructor(private s3Service: S3Service, private responseService: ResponseService) {}

    async importProductsFile({ queryStringParameters: { name } }) {
        if (!name) {
            return this.responseService.error(new Error('File name must be specified'), { statusCode: 400 });
        }

        const url = await this.s3Service.upload(name)

        return this.responseService.success({ statusCode: 200, body: { url } })
    }

    async importFileParser({ Records }) {
        await this.s3Service.parse(Records)
        return this.responseService.success({ statusCode: 200 })
    }

    static create(s3Service: S3Service, responseService: ResponseService) {
        if (!app) {
            app = new App(s3Service, responseService)
        }

        return app
    }
}
