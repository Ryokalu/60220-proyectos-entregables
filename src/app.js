import express from "express"
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import { Server } from 'socket.io'
import viewProducts from "./routes/products.router.js";
import ProductManager from "./public/js/productManager.js";

let products = new ProductManager("json")

const app = express();
const PORT = "8080";

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))



const httpServer = app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})


const socketSer = new Server(httpServer)

app.use('/', viewProducts)

socketSer.on('connection', socket => {
    console.log("Usuario Conectado")
    socketSer.emit('d', "Conectado")

    socket.on('add', async data => {


        let title = data[0].title
        let des = data[0].description
        let price = data[0].price
        let thum = data[0].thumbnail
        let code = data[0].code
        let stock = data[0].stock
        let cat = data[0].category


        const status = await products.addproduct(title, des, price, thum, code, stock, cat)

        if (status === 1) {
            socketSer.emit('error', 1) //Error de codigo Repetido
        }
        else if (status === 3) {
            socketSer.emit('error', 3) // error de campos vacios 
        }
        else {
            const newList = await products.getProduct()
            socketSer.emit('success', newList)
        }
    })

    socket.on('del', async data => {
        let ID = data

        let status = await products.deleteProductByID(ID)

        if (status === 1) {
            socketSer.emit('error', 4) //identificador no encontrado
        }
        else if (status === 3) {
            socketSer.emit('error', 5) // listado no encontrado
        }
        else {
            const newList = await products.getProduct()
            socketSer.emit('success', newList)
        }




    })
})


export default httpServer;

