import fs from 'fs';
import __dirname from '../../utils.js';
import ProductManager from './productManager.js';



class Carrito {
    constructor(id) {
        this.id = id
        this.productos = []
    }
}

class CartManager {

    #fileSys
    #filePath



    constructor(path) {
        this.path = path + "/json"
        this.#fileSys = fs;
        this.#filePath = this.path + "/Carrito.json"
    }


    async createCart() {

        await this.#fileSys.promises.mkdir(this.path, { recursive: true });

        if (!this.#fileSys.existsSync(this.#filePath)) {
            await this.#fileSys.promises.writeFile(this.#filePath, "[]")
        }

        let carritoTest = new Array()
        await this.#fileSys.promises.mkdir(this.path, { recursive: true });

        let jsonCart = await this.#fileSys.promises.readFile(this.#filePath, 'utf-8')
        carritoTest = JSON.parse(jsonCart)
        const cid = Math.floor(Math.random() * (1000 - 1 + 1) + 1)
        let newCart = new Carrito(cid)
        carritoTest.push(newCart)

        const cartFiles = await this.#fileSys.promises.writeFile(this.#filePath, JSON.stringify(carritoTest, null, 2, '\t'))

        return 1

    }

    async getCartsbyID(cid) {

        await this.#fileSys.promises.mkdir(this.path, { recursive: true });

        if (this.#fileSys.existsSync(this.#filePath)) {
            let CartFile = await this.#fileSys.promises.readFile(this.#filePath, "utf-8")
            let lista = JSON.parse(CartFile)
            let buscarID = lista.find(buscar => buscar.id === cid)
            if (buscarID === undefined) {
                let mensaje = 1;
                return mensaje;
            }
            else return buscarID
        }
        else return 3
    }



    async addProductAtCart(cid, pid) {

        await this.#fileSys.promises.mkdir(this.path, { recursive: true });

        let Product_Id = pid

        const prod = new ProductManager("json")

        let cartFind = await this.getCartsbyID(cid)
        let prodFind = await prod.getProductById(pid)

        if (cartFind === 1) return 1
        if (prodFind === 1) return 3

        let quantity = 1

        let listProd = { Product_Id, quantity }

        let find = false

        for (let i = 0; i < cartFind.productos.length; i++) {
            if (cartFind.productos[i].Product_Id === pid) {
                cartFind.productos[i].quantity = cartFind.productos[i].quantity + 1
                find = true
            }

        }

        if (find) {

            let update = this.updateCartById(cid, cartFind)
            return update

        }

        cartFind.productos.push(listProd)
        let update = this.updateCartById(cid, cartFind)
        return update
    }

    async updateCartById(cid, newData) {
        if (this.#fileSys.existsSync(this.#filePath)) {

            let CartFile = await this.#fileSys.promises.readFile(this.#filePath, "utf-8")
            let list = JSON.parse(CartFile)
            let item = list.findIndex(search => search.id === cid)

            if (item !== -1) {
                list[item] = { ...list[item], ...newData }
                await this.#fileSys.promises.writeFile(this.#filePath, JSON.stringify(list, null, 2, '\t'))
                return list[item]
            }
        }
        else return 'lista no encontrado'
    }

    async getCarts() {

        await this.#fileSys.promises.mkdir(this.path, { recursive: true })
        if (this.#fileSys.existsSync(this.#filePath)) {
            let cartFile = await this.#fileSys.promises.readFile(this.#filePath, "utf-8")
            let lista = JSON.parse(cartFile)
            return lista
        }
        else return 1

    }
}

export default CartManager