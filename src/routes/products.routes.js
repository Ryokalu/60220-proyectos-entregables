import { Router } from "express";
// import ProdServices from "../services/products.services.js";

import {
    find_All_products,
    add_product,
    delete_product,
    update_product_by_ID,
    find_product_by_ID,
} from "../controllers/product.controller.js"

const router = Router()
router.get('/', find_All_products)
router.post('/', add_product)
router.delete('/:_id', delete_product)
router.put('/:_id', update_product_by_ID)
router.get('/:_id', find_product_by_ID)

export default router




