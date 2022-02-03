import { Client } from 'pg';
import { App } from './src/app';
import { PgProductService } from './src/services/product.service';
import { ResponseService } from './src/services/response.service';

import 'source-map-support/register';

const dbClient = new Client();
dbClient.connect();

const app = App.create(new PgProductService(dbClient), new ResponseService())

export const getProducts = () => {
    return app.getProducts()
}

export const getProductById = (event) => {
    return app.getProductById(event)
}
