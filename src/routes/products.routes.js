import { Router } from "express";
import { authToken, authorization } from "../utils.js";

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
router.post('/', authToken, authorization(["admin", "premium"]), add_product)
router.delete('/:_id', authToken, authorization(["admin", "premium"]), delete_product)
router.put('/:_id', authToken, authorization(["admin", "premium"]), update_product_by_ID)
router.get('/:_id', find_product_by_ID)

export default router




