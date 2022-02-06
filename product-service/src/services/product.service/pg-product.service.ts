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

            const { rows } = await client.query(query);
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

            const { rows } = await client.query(query);
            return rows[0] ?? null;
        } catch (e) {
            console.error(e)
            throw e
        } finally {
            client.release();
        }
    }

    async createProduct({
        title,
        description,
        price,
        logo = 'https://r2.readrate.com/img/pictures/basic/792/792601/7926014/w800h317-a1bf3137.jpg',
        count = 0
    }) {
        const client = await this.dbPool.connect();
        try {
            const query = {
                text: `INSERT INTO ${this.table}(title, description, price, logo, count) VALUES ($1, $2, $3, $4, $5)`,
                values: [title, description, price, logo, count],
            } as QueryConfig;

            await client.query(query);

            return {
                title,
                description,
                price,
                logo,
                count
            };
        } catch (e) {
            console.error(e)
            throw e
        } finally {
            client.release();
        }
    }

    async createProductBatch(products) {
        const client = await this.dbPool.connect();
        let i = 1
        try {
            const query = {
                text: `
                    INSERT INTO ${this.table}(title, description, price, logo, count)
                    VALUES
                       ${products.map(() => `($${i++}, $${i++}, $${i++}, $${i++}, $${i++})`).join(',\n')}
                `,
                values: products.flatMap(({
                  title,
                  description,
                  price,
                  logo,
                  count = 0
                }) => [title, description, price, logo || 'https://r2.readrate.com/img/pictures/basic/792/792601/7926014/w800h317-a1bf3137.jpg', count]),
            } as QueryConfig;

            await client.query(query);

            return products;
        } catch (e) {
            console.error(e)
            throw e
        } finally {
            client.release();
        }
    }
}
