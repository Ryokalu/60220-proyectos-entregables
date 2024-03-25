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
        let productUpdated = await productsModel.updateOne(ID, newData)
        return productUpdated
    }

    getProducts = async (page, limit, find, url, ord) => {

        let query = {}
        if (!page) page = 1
        if (!limit) limit = 10
        if (find) query.category = capitalizeFirstLetter(find)
        let sort = ""
        if (ord === "asc") sort = { "price": 1 }
        if (ord === "desc") sort = { "price": -1 }
        let options = { page, limit, lean: true }
        if (ord) options.sort = sort
        let item = await productsModel.paginate(query, options)
        item.prevLink = item.hasPrevPage ? `http://localhost:8080/products?page=${item.prevPage}` : '';
        item.nextLink = item.hasNextPage ? `http://localhost:8080/products?page=${item.nextPage}` : '';
        item.isValid = !(page < 1 || page > item.totalPages)
        let status
        status = item.isValid ? status = "success" : status = "error"
        let result = {
            "valid": item.isValid,
            "status": status,
            "payload": item.docs,
            "totalPages": item.totalPages,
            "prevPage": item.prevPage,
            "prevPage": item.nextPage,
            "page": page,
            "hasPrevPage": item.hasPrevPage,
            "hasNextPage": item.hasNextPage,
            "prevLink": item.prevLink,
            "nextLink": item.nextLink
        }
        return result
    }
}

// esta funcion solo hace que el primer caracter del texto ingresado sea en mayusculas y el resto de los caracteres sean minusculas
// observe que el filtro es sensible a las mayusculas, quiero prevenir que se ingrese el texto incorrecto
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
