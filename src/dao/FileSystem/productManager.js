import fs from 'fs';
import __dirname from '../../utils.js';

class Productos {
    constructor(id, title, description, price, thumbnail, code, stock, category) {
        this.id = id
        this.title = title
        this.description = description
        this.code = code
        this.price = price
        this.status = true
        this.stock = stock
        this.category = category
        this.thumbnail = thumbnail

    }
}

class ProductManager {

    #fileSys
    #prod
    #filePath


    constructor(path) {
        this.path = path + "/json"
        this.#fileSys = fs;
        this.#filePath = this.path + "/Productos.json"
        this.#prod = new Array()
    }


    async addproduct(title, description, price, thumbnail, code, stock, category) {


        try {
            let val1 = false
            let val2 = false
            if (typeof title && typeof description && typeof price && typeof category && typeof code && typeof stock === 'undefined') {
                val1 = true;
            }
            if (title === "" || description === "" || price === "" || category === "" || code === "" || stock === "" || category === "") {
                val2 = true;
            }
            if (!val1 && !val2) {

                await this.#fileSys.promises.mkdir(this.path, { recursive: true });

                if (!this.#fileSys.existsSync(this.#filePath)) {
                    await this.#fileSys.promises.writeFile(this.#filePath, "[]")
                }

                let prodFiles = await this.#fileSys.promises.readFile(this.#filePath, 'utf-8')
                this.#prod = JSON.parse(prodFiles)

                let idAleatorio = this.#prod.length + Math.floor(Math.random() * (1000 - 1 + 1) + 1)

                let newProd = new Productos(idAleatorio + 1, title, description, price, thumbnail, code, stock, category);
                this.#prod.push(newProd)

                let codeValidate = false
                let emptyArray = false

                if (prodFiles === "[]") {
                    emptyArray = true
                }

                if (emptyArray) {
                    await this.#fileSys.promises.writeFile(this.#filePath, JSON.stringify(this.#prod, null, 2, '\t'))
                }
                else {
                    for (let i = 0; i < this.#prod.length - 1; i++) {
                        if (this.#prod[i].code === code) {
                            codeValidate = true;
                        }
                    }
                    if (!codeValidate) {
                        await this.#fileSys.promises.writeFile(this.#filePath, JSON.stringify(this.#prod, null, 2, '\t'))
                    }
                    else {
                        return 1
                    }
                }
            }
            else {
                return 3
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getProduct() {
        await this.#fileSys.promises.mkdir(this.path, { recursive: true });
        if (this.#fileSys.existsSync(this.#filePath)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#filePath, "utf-8")
            let lista = JSON.parse(ProductosFile)
            return lista
        }
        else return 1
    }

    async getProductById(id) {
        if (this.#fileSys.existsSync(this.#filePath)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#filePath, "utf-8")
            let lista = JSON.parse(ProductosFile)
            let buscarID = lista.filter(buscar => buscar.id === id)
            if (buscarID.length === 0) {
                let mensaje = 1;
                return mensaje;
            }

            else return buscarID
        }
        else return 3
    }

    async deleteProductByID(id) {
        if (this.#fileSys.existsSync(this.#filePath)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#filePath, "utf-8")
            let lista = JSON.parse(ProductosFile)
            let listaLargo = lista.length
            let prodEliminado = lista.filter(buscar => buscar.id !== id)
            let prodEliminadoLargo = prodEliminado.length
            if (listaLargo === prodEliminadoLargo) { // es para identificar si se encontro el elemento
                return 1
            }
            else {
                await this.#fileSys.promises.writeFile(this.#filePath, JSON.stringify(prodEliminado, null, 2, '\t'))
                return 2
            }
        }
        else return 3
    }

    async updateitemById(id, datoCambiar) {
        if (this.#fileSys.existsSync(this.#filePath)) {
            let ProductosFile = await this.#fileSys.promises.readFile(this.#filePath, "utf-8")
            let lista = JSON.parse(ProductosFile)
            let indice = lista.findIndex(buscar => buscar.id === id)
            if (indice !== -1) {
                lista[indice] = { ...lista[indice], ...datoCambiar }
                await this.#fileSys.promises.writeFile(this.#filePath, JSON.stringify(lista, null, 2, '\t'))
                return `Identificador "${id}" modificado correctamente"`
            } else return 1

        } else return 3
    }

}

export default ProductManager;