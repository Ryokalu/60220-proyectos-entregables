import { Router } from "express";
import { generateRandomProd } from "../controllers/mock.controller.js";


const router = Router()


router.get('/mockingproducts', generateRandomProd)


export default router