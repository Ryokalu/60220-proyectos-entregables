import { Router } from "express";

const router = new Router()


router.get('/', (req, res) => {

    req.loggers.fatal(`${req.method} en ${req.url} - Fecha ${new Date().toLocaleDateString()} - HORA ${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO FATAL <-----`)

    req.loggers.error(`${req.method} en ${req.url} - Fecha ${new Date().toLocaleDateString()} - HORA${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO ERROR <-----`)

    req.loggers.warning(`${req.method} en ${req.url} - Fecha ${new Date().toLocaleDateString()} - HORA${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO WARNING <-----`)

    req.loggers.http(`${req.method} en ${req.url} - Fecha ${new Date().toLocaleDateString()} - HORA${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO HTTP <-----`)

    req.loggers.info(`${req.method} en ${req.url} - Fecha ${new Date().toLocaleDateString()} - HORA ${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO INFO <-----`)

    req.loggers.debug(`${req.method} en ${req.url} - Fecha ${new Date().toLocaleDateString()} - HORA ${new Date().toLocaleTimeString()} -----> MENSAJE SOLO VISIBLE PARA EL MODE DEV <-----`)


    res.send("Revisar la consola y los Logs")
})

export default router