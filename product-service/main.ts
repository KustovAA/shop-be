import { App } from './src/app';
import { StubProductService } from './src/services/product.service';
import { ResponseService } from './src/services/response.service';

import 'source-map-support/register';

const app = App.create(new StubProductService(), new ResponseService())

export const getProducts = () => {
    return app.getProducts()
}

export const getProductById = (event) => {
    return app.getProductById(event)
}
