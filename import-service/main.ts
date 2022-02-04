import { App } from './src/app';
import { ResponseService } from '../common/services/response.service';
import { S3Service } from './src/services/s3-service';

const app = App.create(new S3Service('eu-west-1', 'shop-storage-bucket'), new ResponseService())

export const importProductsFile = (event) => {
    return app.importProductsFile(event)
}

export const importFileParser = (event) => {
    return app.importFileParser(event)
}