import express from "express";
import ProductManager from "../public/js/productManager.js";
import { Server } from "socket.io";

const router = express.Router()

let products = new ProductManager("json")
const list = await products.getProduct()

router.get('/', (req, res) => {
    res.render("home", {
        list,
        style: "home.css",
        subTitle: "Home"
    })
})


router.get('/realtimeproducts', (req, res) => {
    res.render("realTimeProducts", {
        list,
        subTitle: "Real Time Products",
        style: "realTimeProducts.css"
    })

})
export default router