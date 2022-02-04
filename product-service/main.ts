import { Pool } from 'pg';
import { App } from './src/app';
import { PgProductService } from './src/services/product.service';
import { ResponseService } from './src/services/response.service';

import 'source-map-support/register';

const { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env

const dbPool = new Pool({
    host: PGHOST,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: Number(PGPORT),
    connectionTimeoutMillis: 5000,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20
});

const app = App.create(new PgProductService(dbPool), new ResponseService())

export const getProducts = () => {
    return app.getProducts();
}

export const getProductById = (event) => {
    return app.getProductById(event);
}

export const createProduct = (event) => {
    return app.createProduct(event);
}
