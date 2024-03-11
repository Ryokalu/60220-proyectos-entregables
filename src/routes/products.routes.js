import { Router } from "express";
import ProdServices from "../dao/db/products.services.js";

const router = Router()
const ProdManager = new ProdServices();


router.get('/', async (req, res) => {
    try {

        const list = await ProdManager.findAll()
        res.send({ result: "success", payload: list })
    }
    catch (e) {
        res.status(500).send("un error ha ocurrido")
    }
})


router.post('/', async (req, res) => {
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
            let status = await ProdManager.Insert(data)
            res.send(status)
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
})

router.delete('/:_id', async (req, res) => {
    try {
        let _id = req.params
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
})

router.put('/:_id', async (req, res) => {
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
})

router.get('/:_id', async (req, res) => {
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


})

export default router