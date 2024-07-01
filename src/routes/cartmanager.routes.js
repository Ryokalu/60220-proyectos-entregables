import { Router } from "express";
import { authToken, authorization } from "../utils.js";

import {
    find_All_Carts,
    create_Cart,
    find_Cart_By_ID,
    get_Products_in_Cart,
    delete_Cart,
    delete_Product_In_Cart,
    update_Cart,
    update_Quantity,
    cart_purchases,
} from '../controllers/cart.controller.js'


const router = Router();


router.get('/', find_All_Carts)
// router.post('/', create_Cart) // Sin uso actualmente
router.get('/:_id', find_Cart_By_ID)
router.post('/:cid/products/:pid', authToken, authorization(["user", "premium"]), get_Products_in_Cart)
// router.delete('/:_id', delete_Cart) // Sin uso actualmente
router.delete('/:cid/products/:pid', delete_Product_In_Cart)
// router.put('/:_id', update_Cart) // Sin uso actualmente
router.put('/:cid/products/:pid', update_Quantity)
router.post('/:cid/purchases', cart_purchases)

export default router




