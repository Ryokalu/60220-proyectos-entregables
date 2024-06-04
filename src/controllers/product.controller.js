import ProdServices from "../services/products.services.js";
import cartServices from "../services/cart.services.js";
import { createProdError, deleteProdError } from "../services/errors/messages/products.errors.js";
import customError from "../services/errors/customError.js";

import { v4 as uuid } from 'uuid'


const ProdManager = new ProdServices();

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

            if (req.user.role === "premium") data.owner = req.user.email

            data.status = true
            data.code = uuid()
            let status = await ProdManager.Insert(data)

            res.send({ status: "success", paylaod: status })
        }
        else {
            customError.createError({
                name: "error al Crear el producto",
                cause: createProdError({ title: data.title, description: data.description, price: data.price, stock: data.stock, category: data.category, thumbnail: data.thumbnail }),
                message: "La informacion entregada es incorrecta"
            })


        }
    }
    catch (e) {
        if (e.code === 11000) {
            res.status(400).send("Codigo repetido, Favor de utilizar otro")
        }
        else if (e.name === "error al Crear el producto") {
            res.status(400).send("Campos Vacios, favor de revisar Vacios")
        }
        else {
            console.log(e)
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const delete_product = async (req, res) => {
    try {
        let _id = req.params

        let valid = false

        const prod = await ProdManager.findOne(_id)

        if (prod[0].owner === req.user.email) valid = true
        if (req.user.role === "admin") valid = true

        console.log(valid)

        if (!_id) {

            customError.createError({
                name: "error al borrar el producto",
                cause: deleteProdError(_id),
                message: "el id indicado se encuentra vacio"
            })

        }



        if (!valid) return res.status(401).send(`No tienes permisos para borrar este producto`)

        let status = await ProdManager.delete(_id)
        res.send(status)
    }
    catch (e) {

        if (e.path === "_id") {
            res.status(500).send(`producto con id ${e.value} no encontrado`)
        }
        else if (e.name = "error al borrar el producto") {
            res.status(500).send(`Campos vacios, favor de revisar`)
        }
        else {
            console.log(e)
            res.status(500).send("un error ha ocurrido")
        }

    }
}

export const update_product_by_ID = async (req, res) => {
    try {
        let _id = req.params
        let newData = req.body


        let empty = false
        for (const key in newData) {
            if (Object.hasOwnProperty.call(newData, key)) { }

            let check = newData[key]

            if (check.trim() === "") {
                empty = true
            }
        }

        let valid = false

        if (!empty) {


            const prod = await ProdManager.findOne(_id)

            if (prod[0].owner === req.user.email) valid = true
            if (req.user.role === "admin") valid = true

            if (!valid) return res.status(401).send(`No tienes permisos para modificar este producto`)

            newData.status = true
            let status = await ProdManager.update(newData, _id)
            if (status.acknowledged === true) {
                res.send("producto modificado correctamente")
            }
            else {
                res.send("producto no encontrado")
            }
        }
        else {
            customError.createError({
                name: "error al modificar el producto",
                cause: createProdError({ title: newData.title, description: newData.description, price: newData.price, stock: newData.stock, category: newData.category, thumbnail: newData.thumbnail }),
                message: "Un error ocurrio al crear los productos"
            })


        }
    }
    catch (e) {
        if (e.path === "_id") {
            res.status(500).send(`producto con id ${e.value} no encontrado`)
        }
        else if (e.name) {

            res.status(400).send("Campos Vacios, favor de revisar")
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

