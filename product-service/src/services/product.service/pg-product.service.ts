import { IProductService } from './types'
import { Pool, QueryConfig } from 'pg';

export class PgProductService implements IProductService {
    protected table = 'products';

    constructor(private dbPool: Pool){}

    async getProductList() {
        const client = await this.dbPool.connect();
        try {
            const query = {
                text: `SELECT * FROM ${this.table}`,
            } as QueryConfig;

            const {rows} = await client.query(query);
            return rows ?? null;
        } catch (e) {
            console.error(e)
            throw e
        } finally {
            client.release();
        }
    }

    async getProductById(productId) {
        const client = await this.dbPool.connect();
        try {
            const query = {
                text: `SELECT * FROM ${this.table} WHERE id = $1`,
                values: [productId],
            } as QueryConfig;

            const {rows} = await client.query(query);
            return rows[0] ?? null;
        } catch (e) {
            console.error(e)
            throw e
        } finally {
            client.release();
        }
    }
}
