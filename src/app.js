import express from "express";
import cartRoutes from "./routes/cart.routes.js"
import prodRoutes from "./routes/products.routes.js"
import __dirname from "../utils.js";

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/src/public'))

const PORT = 8080




app.use('/api/product', prodRoutes)
app.use('/api/cart', cartRoutes)

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento En el Puerto "${PORT}"`)
})