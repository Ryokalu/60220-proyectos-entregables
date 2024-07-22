import { Router } from "express";
import { index_products_get } from "../controllers/product.controller.js"
import { index_render_Cart } from "../controllers/cart.controller.js";


const router = Router()

router.get('/products', index_products_get)
router.get('/cart/:_id', index_render_Cart)

router.get('/', async (req, res) => {
    res.redirect('/login')
})




export default router