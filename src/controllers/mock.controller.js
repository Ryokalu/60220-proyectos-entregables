import { generaterProducts } from "../utils.js";
import ProdServices from "../services/products.services.js";

const ProdManager = new ProdServices()

export const generateRandomProd = async (req, res) => {
    try {
        for (let i = 0; i < 100; i++) {
            ProdManager.Insert(generaterProducts())
        }
        res.send("Productos creados con exito")

    }
    catch (e) {
        console.log(e)
    }
}