import { Router } from "express";
import cartServices from "../dao/db/cart.services.js";
import { productsModel } from "../dao/db/models/products.js";

const router = Router();
const cartManager = new cartServices();

router.get('/', async (req, res) => {
    try {
        let list = await cartManager.findAll()
        res.send({ result: "success", payload: list })
    }
    catch (e) {
        res.status(500).send("un error ha ocurrido")
    }

})

router.post('/', async (req, res) => {
    try {
        let cart = await cartManager.createCart()
        res.send({ result: "success", payload: cart })
    }
    catch (e) {

        res.status(500).send("un error ha ocurrido")

    }

})


router.get('/:_id', async (req, res) => {
    try {
        let ID = req.params
        let list = cartManager.findOne(ID)
        res.send({ result: "success", payload: list })
    }
    catch (e) {
        if (e.path === "_id") {
            res.status(500).send(`carrito con id ${e.value} no encontrado`)
        }
        else {
            res.status(500).send("un error ha ocurrido")
        }
    }
})


router.post('/:cid/products/:pid', async (req, res) => {
    let cart_ID = { _id: req.params.cid }
    let products_ID = { _id: req.params.pid }

    try {
        let status = await cartManager.addProductInCart(cart_ID, products_ID)

        if (status.acknowledged === true) {
            res.send("producto agregado al carro")
        }
        else {
            res.send("favor de revisar los codigos de productos")
        }

    }
    catch (e) {
        if (e.value === cart_ID._id) {
            res.status(500).send(`carrito con id ${e.value} no encontrado`)
        }
        else if (e.value = products_ID._id) {
            res.status(500).send(`Producto con id ${e.value} no encontrado`)
        } else {
            res.status(500).send("un error ha ocurrido")
        }
    }
})

export default router




