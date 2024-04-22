import userProvider from "../services/user.services.js";
import { tokenGenerator, validpass } from '../utils.js'

const userManager = new userProvider();

export const WEB_LOGIN = async (req, res) => { // sitio del login
    res.render('login', { subTitle: "inicio de sesion" })
}

export const WEB_REGISTER = async (req, res) => { // sitio del registro
    res.render('register', { subTitle: "Registro de nuevo usuario" })
}

export const user_register_post = async (req, res) => {
    res.send({ status: "success", message: "usuario Creado" })
}

export const user_login_post = async (req, res) => {
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
}

export const user_logout_get = (req, res) => {
    req.logout(err => {
        req.session.destroy(error => {
            return res.redirect('/login')
        })
    })
}

export const user_register_fail = (req, res) => {
    res.status(401).send({ error: "fallo al registrar el usuario" })
}

export const user_login_fail = (req, res) => {
    res.status(401).send({ error: "fallo al momento del iniciar sesion" })
}

export const githubCallback_authenticate = async (req, res) => {

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
}

export const github_authenticate = async (req, res) => { }

export const current_user_id = async (req, res) => {
    res.send(req.user)
}

export const render_User = async (req, res) => {
    res.render('user')
}
