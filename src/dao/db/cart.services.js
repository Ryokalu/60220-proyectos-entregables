import { cartsModel } from "./models/cart.js";
import ProdServices from "./products.services.js";

const prodServices = new ProdServices()

export default class cartServices {
    constructor() { }

    findAll = async () => {
        let carts = await cartsModel.find()
        return carts.map(carts => carts.toObject())
    }

    createCart = async () => {
        let status = await cartsModel.create({ products: [] })
        return status
    }

    addProductInCart = async (cid, pid) => {
        let cart = await this.findOne(cid)
        let prod = await prodServices.findOne(pid)

        let find = false
        for (let i = 0; i < cart[0].products.length; i++) {
            let id = cart[0].products[i].products._id.toString()
            if (id === pid._id.toString()) {
                cart[0].products[i].quantity++
                find = true
            }
        }

        if (find) {

            let status = await cartsModel.updateOne(cid, cart[0])
            return status

        }
        else {
            cart[0].products.push({ "products": prod[0].id })
            let indice = cart[0].products.length - 1
            cart[0].products[indice].quantity = 1

            let status = await cartsModel.updateOne(cid, cart[0])
            return status
        }



    }

    findOne = async (ID) => {
        let cart = await cartsModel.find(ID)
        return cart
    }

    delete = async (ID) => {
        let cart = await cartsModel.deleteOne(ID)
        return cart
    }


}