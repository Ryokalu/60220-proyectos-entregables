import __dirname from "./utils.js";
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars"
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cartmanager.routes.js"
import chatRouter from "./routes/chat.routes.js"
import { Server } from 'socket.io'
import chatServices from "./services/chat.services.js";
import { storeMessage, getMessage } from './controllers/chat.controller.js'
import indexRouter from "./routes/index.routes.js"
import userRouter from "./routes/user.routes.js"
import session from "express-session"
import connect from "connect-mongo"
import githubViewRouter from './routes/github.views.routes.js'
import mockRandom from './routes/mock.routes.js'
import loggerTest from './routes/loggers.routes.js'
import recoverPass from './routes/emailrecover.routes.js'

import passport from "passport";
import initPassport from "./config/passport.config.js";
import configEnv from "./config/env/config.js"

import { logger } from "./config/loggers/custom.logger.js";

// docs
import swaggerUI from "swagger-ui-express"
import { swaggerSpecs } from "./swagger.specs.js";


let chat = new chatServices();

const app = express()
// const PORT = "8080"
const PORT = configEnv.port


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'))

const URL_MONGO = configEnv.mongoUrl

app.use(session({
    store: connect.create({
        mongoUrl: URL_MONGO,
        ttl: 3600 // 30 min
    }),
    secret: "m1S3cr3t0",
    resave: false,
    saveUninitialized: true
}))


initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/github", githubViewRouter)
app.use("/", chatRouter)
app.use("/", indexRouter)
app.use("/", userRouter)
app.use("/", mockRandom)
app.use("/", loggerTest)
app.use("/recover", recoverPass)

// api docs
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))



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
    console.log("usuario conectado")
    socket_Server.emit('log', logs)

    socket.on("message", async messagedata => {
        await chat.saveMessage(messagedata)
        logs = await chat.loadMessage()


        socket_Server.emit('log', logs)
    })

})


