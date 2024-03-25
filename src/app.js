import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars"
import __dirname from "./utils.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cartmanager.routes.js"
import chatRouter from "./routes/chat.routes.js"
import { Server } from 'socket.io'
import chatServices from "./dao/db/chat.services.js";
import indexRouter from "./routes/index.routes.js"
import userRouter from "./routes/user.routes.js"
import session from "express-session"
import connect from "connect-mongo"

let chat = new chatServices();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'))

const URL_MONGO = 'mongodb+srv://josesanpino:8yWEyM8BthjtnZGH@cluster0.6nbikyo.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'

app.use(session({
    store: connect.create({
        mongoUrl: URL_MONGO,
        // mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 3600 // 30 min
    }),
    secret: "m1S3cr3t0",
    resave: false,
    saveUninitialized: true
}))

const PORT = "8080"

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", chatRouter)
app.use("/", indexRouter)
app.use("/", userRouter)


const http_Server = app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})

const mongoConnect = async () => {
    try {
        mongoose.connect(URL_MONGO)
        console.log("CONECTADO a la base de datos de MongoDB")
    }
    catch (e) {
        console.error("No se puede conectar a la base de datos: " + e)
        process.exit();
    }
}

mongoConnect()

const socket_Server = new Server(http_Server)
let logs = await chat.loadMessage()

socket_Server.on('connection', socket => {
    console.log("usario conectado")
    socket_Server.emit('log', logs)

    socket.on("message", async messagedata => {
        await chat.saveMessage(messagedata)
        logs = await chat.loadMessage()
        socket_Server.emit('log', logs)

    })

})


