type Product = Record<string, any>

export interface IProductService {
    getProductList(): Promise<Product[]>
    getProductById(productId: string): Promise<Product | undefined>
    createProduct(product: Product): Promise<Product | undefined>
}
