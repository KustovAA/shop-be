export interface IProductService {
    getProductList(): Record<string, any>[]
    getProductById(productId: string): ReturnType<IProductService['getProductList']>[number] | undefined
}
