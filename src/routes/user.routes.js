import { Router } from "express";
import userProvider from "../dao/db/user.services.js";
import passport from "passport";

const router = Router()
const userManager = new userProvider();

router.get('/login', async (req, res) => { // sitio del login
    res.render('login', { subTitle: "inicio de sesion" })
})


router.get('/register', async (req, res) => { // sitio del registro
    res.render('register', { subTitle: "Registro de nuevo usuario" })
})

router.post("/user/register", passport.authenticate('register', { failureRedirect: '/user/fallo-registro' }),
    async (req, res) => {
        res.send({ status: "success", message: "usuario Creado" })
    })

router.post("/user/login", passport.authenticate('login', { failureRedirect: '/user/fallo-login' }),
    async (req, res) => {
        const user = req.user;

        if (!user) return res.status(401).send({ status: "error", error: "usuario no encontrado" })

        let user_name = `${user.first_name} ${user.last_name}`
        req.session.user = {
            name: user_name,
            email: user.email,
            age: user.age,
        }


        if (user.email === "adminCoder@coder.com") req.session.user.rol = "admin"
        else req.session.user.rol = "user"

        res.send({ status: "success", payload: req.session.user })

    })


router.get('/user/logout', (req, res) => {
    req.logout(err => {
        req.session.destroy(error => {
            return res.redirect('/login')
        })
    })
})

router.get("/user/fallo-registro", (req, res) => {
    res.status(401).send({ error: "fallo al registrar el usuario" })
})

router.get("/user/fallo-login", (req, res) => {
    res.status(401).send({ error: "fallo al momento del iniciar sesion" })
})

router.get('/user/githubCallback', passport.authenticate('github', { failureRedirect: '/github/error' }),
    async (req, res) => {

        const user = req.user

        let user_name = `${user.first_name} ${user.last_name}`
        req.session.user = {
            name: user_name,
            email: user.email,
            age: user.age,
        }

        if (user.email === "adminCoder@coder.com") req.session.user.rol = "admin"
        else req.session.user.rol = "user"

        // res.send({ status: "success", payload: req.session.user })
        res.redirect("/products")
    })

router.get('/user/github', passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => { })



export default router