import { Router } from "express";
import userProvider from "../dao/db/user.services.js";

const router = Router()
const userManager = new userProvider();

router.get('/login', async (req, res) => { // sitio del login
    res.render('login', { subTitle: "inicio de sesion" })
})


router.get('/register', async (req, res) => { // sitio del registro
    res.render('register', { subTitle: "Registro de nuevo usuario" })
})

router.post('/user/login', async (req, res) => { // logica para iniciar de sesion
    try {


        const { email, password } = req.body

        const user = await userManager.findOne({ email, password })

        if (!user[0]) {

            return res.status(401).send({ status: "error", error: "Datos incorrectos" })
        }

        let user_name = `${user[0].first_name} ${user[0].last_name}`
        req.session.user = {
            name: user_name,
            email: user[0].email,
            age: user[0].age,
        }

        if (user[0].email === "adminCoder@coder.com") req.session.user.rol = "admin"
        else req.session.user.rol = "user"


        res.send({ status: "success", payload: req.session.user })
    }
    catch (e) {
        console.log(e)
    }

})


router.post('/user/register', async (req, res) => { // logica para registrar usuario
    try {
        const user_data = req.body


        const exist = await userManager.findOne({ email: user_data.email })

        const status = await userManager.createrUser(user_data)

        res.send({ status: "success", message: "Usuario Registrado" })
    }
    catch (e) {
        if (e.code === 11000) {

            return res.status(402).send({ status: "error", message: "Usuario ya existe" })
        }
    }

})

router.get('/user/logout', async (req, res) => { // logica para registrar usuario
    req.session.destroy(error => {
        return res.redirect('/login')
    })

})



export default router