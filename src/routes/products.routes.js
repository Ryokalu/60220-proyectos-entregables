import { Router } from "express";
import ProductManager from "../public/productManager.js";

const router = Router();
const prodManager = new ProductManager("json")


router.get('/', async (req, res) => {
    try {
        const productList = await prodManager.getProduct()
        if (productList === 1) res.send(400).send("SIN DATA")

        res.json(productList)
    }
    catch (error) {
        res.status(500).send("Un error ha ocurrido")
    }
})


router.post('/', async (req, res) => {
    try {
        const prodData = req.body

        let { title } = req.body
        let { description } = req.body
        let { price } = req.body
        let { thumbnail } = req.body
        let { code } = req.body
        let { stock } = req.body
        let { category } = req.body

        const addProd = await prodManager.addproduct(title, description, price, thumbnail, code, stock, category)


        if (addProd === 1) {
            res.status(400).send("Codigo Repetido")
        }

        if (addProd === 3) {
            res.status(400).send("No dejar campos vacios")
        }

        res.send(`Producto agregado correctamente`)


    }
    catch (error) {
        res.status(500).send("ha ocurrido un error")
        console.log(error)
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params

        const deleteProd = await prodManager.deleteProductByID(parseInt(pid))

        if (deleteProd === 1) res.status(400).send(`Identificador "${pid}" no encontrado`)
        if (deleteProd === 3) res.status(400).send("lista no encontrado D:")

        res.send(deleteProd)
    }
    catch (error) {
        res.status(500).send("ha ocurrido un error")
    }


})


router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const bodyData = req.body

        const putProd = await prodManager.updateitemById(parseInt(pid), bodyData)
        if (putProd === 1) res.status(400).send(`Identificador "${pid}" no encontrado`)
        if (putProd === 3) res.status(400).send("lista no encontrado D:")
        if (putProd === 2) res.send("producto eliminado")

    }
    catch (error) {
        res.status(500).send("ha ocurrido un error")
    }
})


export default router;
