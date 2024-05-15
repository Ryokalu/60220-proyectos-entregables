import userProvider from "../services/user.services.js";
import userDTO from "../services/DTO/user.dto.js";
import { tokenGenerator, validpass } from '../utils.js'
import CustomError from "../services/errors/customError.js";
import { createUserError, loginUserError, deleteUserError } from "../services/errors/messages/user.errors.js";

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

        // const user = new userDTO(req.body)

        const { email, password } = req.body
        // let user = await userManager.findOne({ email: email })

        if (!email || !password) {

            CustomError.createError({
                name: "Creacion de usuario",
                cause: loginUserError(email, password),
                message: "ocurrio un error al iniciar sesion"
            })



        }

        const findUser = await userManager.findOne({ email: email })

        const user = new userDTO(findUser[0])

        if (findUser.length === 0) return res.status(204).send({ error: "No encontrado", message: "usuario o contraseña no encontrado" })
        if (!validpass(user, password)) return res.status(401).send({ error: "No encontrado", message: "usuario o contraseña no encontrado" })

        const token = {
            name: user.fullname,
            email: user.email,
            age: user.age,
            role: user.role
        }
        const newToken = tokenGenerator(token)

        res.send({ message: "inicio de sesion satisfactorio", token: newToken, id: findUser[0]._id, role: user.role })

    }
    catch (e) {

        if (e.name = "Creacion de usuario") {
            return res.status(400).send({ status: "error", error: "Ocurrio un error con la informacion proporcionada." });
        }
        else {
            return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
        }

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

export const githubCallback_authenticate = async (req, res) => { // REVISAR

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

    const id = req.params.userId

    const findUser = await userManager.findOne({ _id: id })
    req.user.cart = findUser[0].cart._id

    res.send(req.user)
}

export const render_User = async (req, res) => {
    res.render('user')
}

export const render_administrator = async (req, res) => {
    res.render('editProd')
}

export const valid_admin = async (req, res) => {
    res.send(req.user)
}


export const get_User = async (req, res) => {
    const id = req.params.id

    const findUser = await userManager.findOne({ _id: id })

    res.send({ status: "success", payload: findUser[0].cart._id })


}

export const valid_user = async (req, res) => {

    const id = req.params.id

    const findUser = await userManager.findOne({ _id: id })

    const user = {
        role: findUser[0].role,
        email: findUser[0].email
    }

    res.send({ status: "success", payload: user })

}
