import { IProductService } from './services/product.service';
import { ResponseService } from './services/response.service';

let app

export class App {
    constructor(private productService: IProductService, private responseService: ResponseService) {}

    async getProducts() {
        return this.responseService.success({
            statusCode: 200,
            body: this.productService.getProductList()
        })
    }

    async getProductById({ pathParameters }) {
        const { productId } = pathParameters;

        const product = this.productService.getProductById(productId)

        if (!product) {
            return this.responseService.error(new Error('Product not found'), { statusCode: 404 })
        }

        return this.responseService.success({
            statusCode: 200,
            body: product
        })
    }

    static create(productService: IProductService, responseService: ResponseService) {
        if (!app) {
            app = new App(productService, responseService)
        }

        return app
    }
}
