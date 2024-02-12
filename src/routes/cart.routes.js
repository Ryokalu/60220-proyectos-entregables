import { Router } from "express";
import CartManager from "../public/cartManager.js";


const router = Router();
const cartManager = new CartManager("json")



router.get('/', async (req, res) => {
    try {
        const list = await cartManager.getCarts()
        if (list === 1) res.status(500).send("ha ocurrido un error")
        else res.json(list)
    }
    catch (error) {
        res.status(500).send("ha ocurrido un error")
    }
})

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart()

        if (newCart === 1) res.status(200).send("Carrito Creado Correctamente")
        else res.status(500).send("hay un error al momento de crear el Carrito")
    }
    catch (error) {
        res.status(500).send("ha ocurrido un error")
    }

})

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const searchCart = await cartManager.getCartsbyID(parseInt(cid))

        if (searchCart === 1) {

            res.status(400).send("Carrito no encontrado")
        }
        else {
            res.json(searchCart)
        }
    }
    catch (error) {
        res.status(500).send("ha ocurrido un error")
    }


})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid } = req.params
        const { pid } = req.params

        const updateCart = await cartManager.addProductAtCart(parseInt(cid), parseInt(pid))
        if (updateCart === 3) {
            res.status(400).send(`Producto con id: ${pid} no encontrado`)
        }

        if (updateCart === 1) {
            res.status(400).send(`Carrito con id: ${cid} no encontrado`)
        }

        res.json(updateCart)
    }
    catch (error) {
        res.status(500).send("ha ocurrido un error")
        console.log(error)
    }

})

export default router