import { IProductService } from './services/product.service';
import { ResponseService } from '../../common/services/response.service';

let app

export class App {
    private constructor(private productService: IProductService, private responseService: ResponseService) {}

    async getProducts() {
        try {
            const body = await this.productService.getProductList()
            return this.responseService.success({
                statusCode: 200,
                body
            })
        } catch (e) {
            console.error(e)
            return this.responseService.error(new Error('Internal Server Error'), { statusCode: 500 })
        }
    }

    async getProductById({ pathParameters }) {
        try {
            const {productId} = pathParameters;

            const product = await this.productService.getProductById(productId)

            if (!product) {
                return this.responseService.error(new Error('Product not found'), {statusCode: 404})
            }

            return this.responseService.success({
                statusCode: 200,
                body: product
            })
        } catch (e) {
            console.error(e)
            return this.responseService.error(new Error('Internal Server Error'), { statusCode: 500 })
        }
    }

    async createProduct(event) {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
        try {
            const product = await this.productService.createProduct(body)

            if (!product) {
                return this.responseService.error(new Error('Product was not created'), {statusCode: 500})
            }

            return this.responseService.success({
                statusCode: 200,
                body: product,
            })
        } catch (e) {
            console.error(e)
            return this.responseService.error(new Error('Internal Server Error'), { statusCode: 500 })
        }
    }

    async createProductBatch(event) {
        const { Records } = event;
        const body = Records.map((record) => typeof record.body === 'string' ? JSON.parse(record.body) : record.body);
        try {
            const products = await this.productService.createProductBatch(body)

            if (!products) {
                return this.responseService.error(new Error('Products were not created'), {statusCode: 500})
            }

            return this.responseService.success({
                statusCode: 200,
                body: products,
            })
        } catch (e) {
            console.error(e)
            return this.responseService.error(new Error('Internal Server Error'), { statusCode: 500 })
        }
    }

    static create(productService: IProductService, responseService: ResponseService) {
        if (!app) {
            app = new App(productService, responseService)
        }

        return app
    }
}
