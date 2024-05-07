import ProdServices from "../services/products.services.js";
import cartServices from "../services/cart.services.js";
import { v4 as uuid } from 'uuid'

const ProdManager = new ProdServices();
const cartManager = new cartServices()

export const find_All_products = async (req, res) => {
    try {
        const list = await ProdManager.findAll()
        res.send({ result: "success", payload: list })
    }
    catch (e) {
        res.status(500).send("un error ha ocurrido")
    }
}

export const add_product = async (req, res) => {
    try {
        let data = req.body

        let empty = false
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) { }
            let check = data[key]
            if (check.trim() === "") {
                empty = true
            }
        }
        if (!empty) {
            data.status = true
            data.code = uuid()
            let status = await ProdManager.Insert(data)

            res.send({ status: "success", paylaod: status })
        }
        else {
            res.status(400).send("Campos Vacios")
        }
    }
    catch (e) {
        if (e.code === 11000) {
            res.status(400).send("Codigo repetido, Favor de utilizar otro")
        }
        else {
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const delete_product = async (req, res) => {
    try {
        let _id = req.params
        console.log(_id)
        let status = await ProdManager.delete(_id)
        res.send(status)
    }
    catch (e) {
        if (e.path === "_id") {
            res.status(500).send(`producto con id ${e.value} no encontrado`)
        }
        else {
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const update_product_by_ID = async (req, res) => {
    try {
        let _id = req.params
        let newData = req.body
        newData.status = true
        let status = await ProdManager.update(newData, _id)
        if (status.acknowledged === true) {
            res.send("producto modificado correctamente")
        }
        else {
            res.send("producto no encontrado")
        }
    }
    catch (e) {
        if (e.path === "_id") {
            res.status(500).send(`producto con id ${e.value} no encontrado`)
        }
        else {
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const find_product_by_ID = async (req, res) => {
    try {
        let _id = req.params
        const list = await ProdManager.findOne(_id)
        res.send({ result: "success", payload: list })
    }
    catch (e) {
        if (e.path === "_id") {
            res.status(500).send(`producto con id ${e.value} no encontrado`)
        }
        else {
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const index_products_get = async (req, res) => {
    try {


        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let find = req.query.query
        let ord = req.query.sort
        let url = req.protocol + '://' + req.get('host') + req.originalUrl

        let status = await ProdManager.getProducts(page, limit, find, url, ord)
        status.user = req.session.user
        res.render("products", status)
    }
    catch (e) {
        console.log("un error ha ocurrido: " + e);
    }
}

