import cartServices from "../services/cart.services.js";
import userProvider from "../services/user.services.js";
import ProdServices from "../services/products.services.js";

const cartManager = new cartServices();
const userManager = new userProvider();
const ProdManager = new ProdServices();

export const find_All_Carts = async (req, res) => {
    try {
        let list = await cartManager.findAll()

        res.send({ status: "success", payload: list })
    }
    catch (e) {
        res.status(500).send("un error ha ocurrido")
    }

}

export const create_Cart = async (req, res) => {
    try {
        let cart = await cartManager.createCart()

        res.send({ status: "success", payload: cart })
    }
    catch (e) {

        res.status(500).send("un error ha ocurrido")

    }

}

export const find_Cart_By_ID = async (req, res) => {
    try {
        let ID = req.params

        let list = await cartManager.findOne(ID)
        res.send({ status: "success", payload: list })
    }
    catch (e) {
        if (e.path === "_id") {
            res.status(401).send(`carrito con id ${e.value} no encontrado`)
        }
        else {
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const get_Products_in_Cart = async (req, res) => {
    let cart_ID = { _id: req.params.cid }
    let products_ID = { _id: req.params.pid }


    try {

        let valid = false

        const prod = await ProdManager.findOne(products_ID)



        if (req.user.role === "user") valid = true
        if (prod[0].owner !== req.user.email) valid = true

        if (!valid) return res.status(401).send({ response: `No puedes agregar un producto que te pertenece` })

        let status = await cartManager.addProductInCart(cart_ID, products_ID)

        if (status.acknowledged === true) {
            res.send({ response: "producto agregado al carro" })
        }
        else {
            res.send(401)("favor de revisar los codigos de productos")
        }
    }
    catch (e) {
        if (e.value === cart_ID._id) {
            res.status(401).send(`carrito con id ${e.value} no encontrado`)
        }
        else if (e.value = products_ID._id) {
            res.status(401).send(`Producto con id ${e.value} no encontrado`)
        } else {
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const delete_Cart = async (req, res) => {

    let _id = req.params
    try {
        let status = await cartManager.cleanCart(_id)
        res.send(status)
    }
    catch (e) {
        if (e.value === _id._id) {
            res.status(500).send(`carrito con id ${e.value} no encontrado`)
        } else {
            res.status(500).send("un error ha ocurrido")
        }
    }
}

export const delete_Product_In_Cart = async (req, res) => {
    let cid = { _id: req.params.cid }
    let pid = { _id: req.params.pid }

    let status = await cartManager.deleteProductInCartByID(cid, pid)
    res.send(status)
}



export const update_Cart = async (req, res) => {

    let _id = req.params
    let data = req.body

    try {

        await cartManager.cleanCart(_id)
        let status = await cartManager.justUpdate(_id, data)
        if (status.acknowledged === true) {
            res.send("carrito actualizado")
        }
    }
    catch (e) {
        if (e.value === _id._id) {
            res.status(401).send(`carrito con id ${e.value} no encontrado`)
        } else if (e.kind === 'ObjectId') {
            res.status(401).send(`producto con id ${e.value} no encontrado`)
        }
        else {
            res.status(500).send("un error ha ocurrido")
        }
    }

}

export const update_Quantity = async (req, res) => {
    let cid = { _id: req.params.cid }
    let pid = { _id: req.params.pid }
    let data = req.body

    let status = await cartManager.updateProductQuantityByID(cid, pid, data)
    if (status.acknowledged === true) {
        res.send("cantidad actualizada")
    }
}

export const index_render_Cart = async (req, res) => {

    let id = req.params
    let cart = await cartManager.getCartById(id)
    res.render("cart", cart)

}

export const cart_purchases = async (req, res) => {
    try {
        let cid = req.params.cid
        let userID = req.body.user


        let user = await userManager.findOne({ _id: userID })

        let cartStatus = await cartManager.cartPurchase(cid, user[0].email)
        res.send({ status: "success", payload: cartStatus })
    }
    catch (e) {
        res.status(500).send(" no se puede procesar la solicitud ")
        console.log(e)
    }

}

