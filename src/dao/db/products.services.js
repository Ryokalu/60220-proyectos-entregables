import { productsModel } from "./models/products.js";

export default class ProdServices {
    constructor() { }

    findAll = async () => {
        let products = await productsModel.find()
        return products.map(prod => prod.toObject())
    }

    Insert = async (product) => {
        let status = await productsModel.create(product)
        return status
    }

    findOne = async (ID) => {
        let product = await productsModel.find(ID)
        return product
    }

    delete = async (ID) => {
        let status = await productsModel.deleteOne(ID)
        return status
    }

    update = async (newData, ID) => {
        let productUpdated = productsModel.updateOne(ID, newData)
        return productUpdated
    }
}

