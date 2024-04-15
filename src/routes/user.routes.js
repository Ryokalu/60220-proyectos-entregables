import { Router } from "express";
import userProvider from "../dao/db/user.services.js";
import passport from "passport";
import { tokenGenerator, validpass } from '../utils.js'
import { authToken } from "../utils.js";


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




router.post("/user/login", async (req, res) => {
    try {
        const { email, password } = req.body

        let user = await userManager.findOne({ email: email })

        if (user.length === 0) return res.status(204).send({ error: "No encontrado", message: "usuario o contraseña no encontrado" })
        if (!validpass(user, password)) return res.status(401).send({ error: "No encontrado", message: "usuario o contraseña no encontrado" })

        const token = {
            name: `${user[0].first_name} ${user[0].last_name}`,
            email: user[0].email,
            age: user[0].age,
            role: user[0].role
        }
        const newToken = tokenGenerator(token)
        res.send({ message: "inicio de sesion satisfactorio", token: newToken, id: user[0]._id })
    }
    catch (e) {
        console.log(e)
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }
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

router.get('/user/current/:userId', authToken, async (req, res) => {
    res.send(req.user)
})


router.get('/user/current/', async (req, res) => {
    res.render('user')
})

export default router


//deprecated

// router.post("/user/login", passport.authenticate('login', { failureRedirect: '/user/fallo-login' }),
//     async (req, res) => {
//         const user = req.user;

//         if (!user) return res.status(401).send({ status: "error", error: "usuario no encontrado" })

//         let user_name = `${user.first_name} ${user.last_name}`
//         req.session.user = {
//             name: user_name,
//             email: user.email,
//             age: user.age,
//         }


//         if (user.email === "adminCoder@coder.com") req.session.user.rol = "admin"
//         else req.session.user.rol = "user"

//         res.send({ status: "success", payload: req.session.user })

//    })