import { IProductService } from './types'
import { Client, QueryConfig } from 'pg';

export class PgProductService implements IProductService {
    protected table = 'products'

    constructor(private dbClient: Client){}

    async getProductList() {
        const query = {
            text: `SELECT * FROM ${this.table}`,
        } as QueryConfig;

        const { rows } = await this.dbClient.query(query);
        return rows ?? null;
    }

    async getProductById(productId) {
        const query = {
            text: `SELECT * FROM ${this.table} WHERE id = $1`,
            values: [productId],
        } as QueryConfig;

        const { rows } = await this.dbClient.query(query);
        return rows[0] ?? null;
    }
}
