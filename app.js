import express from 'express'
import ProductManager from './ProductManager.js'


const app = express()
const PORT = 8080
const prod = new ProductManager("productos")

app.get('/products', async (req, res) => {
    let allProd = await prod.getProduct()
    let limite = req.query


    if (limite.limit === undefined) res.send({ allProd })
    else {
        let listadoFinal = []
        for (let i = 0; i <= limite.limit - 1; i++) {
            if (allProd[i] !== undefined) {
                listadoFinal.push(allProd[i])
            }
        }
        if (listadoFinal.length === 0) res.send("parece que ingresaste un limite incorrecto porfavor ingresar una valor entre 1 y 10")
        else res.send(listadoFinal)
    }


})

app.get('/products/:pid', async (req, res) => {
    let { pid } = req.params
    const productos = await prod.getProductById(parseInt(pid))
    res.send(productos)
})


app.listen(PORT, () => {
    console.log(`Ejecutando en puerto ${PORT}`)
})


