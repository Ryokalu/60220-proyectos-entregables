import userProvider from "../services/user.services.js";
import userDTO from "../services/DTO/user.dto.js";
import { tokenGenerator, validpass } from '../utils.js'
import CustomError from "../services/errors/customError.js";
import emailSender from "../services/email.services.js"
import { createUserError, loginUserError, deleteUserError } from "../services/errors/messages/user.errors.js";
import { response } from "express";
import cartServices from "../services/cart.services.js";

const userManager = new userProvider();
const emailProvider = new emailSender();

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

        const userConnectionTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`

        findUser[0].last_connection = userConnectionTime

        await userManager.update(findUser[0], { _id: findUser[0]._id })

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

export const user_logout_get = async (req, res) => {

    try {
        const { _id } = req.body



        let user = await userManager.findOne({ '_id': _id })

        const userConnectionTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`

        user[0].last_connection = userConnectionTime

        await userManager.update(user[0], { '_id': user[0]._id })

        res.send({ Response: "Sesion Cerrada Correctamente." })

    }
    catch (e) {
        console.log(e)
        res.status(500).send("Ocurrio un error en el servidor.")
    }


}

export const user_register_fail = (req, res) => {
    res.status(401).send({ error: "fallo al registrar el usuario" })
}

export const user_login_fail = (req, res) => {
    res.status(401).send({ error: "fallo al momento del iniciar sesion" })
}

export const githubCallback_authenticate = async (req, res) => { // REVISAR
    try {

        const email = req.user.email

        const findUser = await userManager.findOne({ email: email })

        const user = new userDTO(findUser[0])

        if (findUser.length === 0) return res.status(204).send({ error: "No encontrado", message: "usuario o contraseña no encontrado" })

        const token = {
            name: user.fullname,
            email: user.email,
            age: user.age,
            role: user.role
        }

        const newToken = tokenGenerator(token)

        const userConnectionTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`

        findUser[0].last_connection = userConnectionTime

        await userManager.update(findUser[0], { _id: findUser[0]._id })

        const data = {
            token: newToken,
            id: findUser[0]._id,
            role: user.role
        }

        const query = new URLSearchParams(data).toString()

        res.redirect(`/github/redirect/?${query}`)
    }
    catch (e) {
        console.log(e)
    }
}

export const github_authenticate = async (req, res) => { }

export const current_user_id = async (req, res) => {
    try {
        const id = req.params.userId

        const findUser = await userManager.findOne({ _id: id })

        req.user.cart = findUser[0].cart._id

        res.send(req.user)
    }
    catch (e) {
        console.log(e)
    }
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

    try {
        const id = req.params.id

        const findUser = await userManager.findOne({ _id: id })

        res.send({ status: "success", payload: findUser[0] })
    }
    catch (e) {
        if (e.value) res.status(401).send({ message: "Usuario no encontrado" })
        else res.status(500).send({ message: "Error con el servidor" })
    }

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

export const user_pass_recover = async (req, res) => {
    res.render('recoverpass')
}

export const user_change_role = async (req, res) => {
    try {

        if (!req.files || req.files.length === 0) return res.status(400).send('no se subieron ningun archivo');

        if (!req.noValid) return res.status(400).send("tipo de archivo no admitido, solo se acepta archivos PDF")

        const { _id } = req.params

        let findUser = await userManager.findOne({ _id })

        if (findUser.length === 0) return res.status(401).send({ response: "usuario no encontrado" })

        findUser[0].role = "premium"

        const status = await userManager.update(findUser[0], { _id })

        if (status.acknowledged = true) return res.send({ response: "Rol Cambiado satisfactoriamente" })
        else return res.send({ response: " no fue posible cambiar el rol" })
    }
    catch (e) {
        console.log(e)
    }
}

export const userUploadDoc = async (req, res) => {

    try {

        if (!req.file) return res.status(400).send("No hay informacion que subir favor de validar")
        else return res.send(req.file.path)


    }
    catch (e) {
        console.log(e)
    }

}

export const findAllUser = async (req, res) => {

    try {

        const users = await userManager.findAll()

        let userArray = []

        for (let i = 0; i < users.length; i++) {

            if (users[i].role !== 'admin') { // ignora del listado a los usuarios Admin por seguridad
                let userData = {
                    name: `${users[i].first_name} ${users[i].last_name}`,
                    email: users[i].email,
                    role: users[i].role
                }
                userArray.push(userData)
            }
        }

        res.send(userArray)

    }
    catch (e) {
        console.log(e)
        res.status(500).send("Ocurrio un error en el servidor.")
    }
}

export const deleteUsersByTime = async (req, res) => {

    try {

        const actualTime = new Date()
        const pastTwoDays = new Date(actualTime)
        pastTwoDays.setDate(actualTime.getDate() - 2)

        const selectedUser = await userManager.selectedUserAfterTwoDays(pastTwoDays)

        let usersEmail = []

        selectedUser.forEach(user => {
            usersEmail.push(user.email.toString())
        })
        const usersDeleted = await userManager.deletedUserAfterTwoDays(pastTwoDays)

        if (usersDeleted.acknowledged === true) {
            usersEmail.forEach(email => {
                emailProvider.massEmailDeleted(email)
            })
            return res.send({ 'status': 'success', 'message': `usuarios eliminados: ${usersDeleted.deletedCount}` })
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send("Ocurrio un error en el servidor.")
    }


}

export const UserEditAdmin = (req, res) => {
    res.render("AdminUserEditor", {
        subTitle: "Editor de ROL", style: "admin.css"
    })
}


export const isAdminOK = (req, res) => {
    res.send({ response: "OK" })
}

export const adminRole = async (req, res) => {

    try {
        const { _id } = req.params
        const { newRole } = req.body

        const user = await userManager.findOne({ _id: _id })

        if (!user) return req.status(401).send({ message: "Usuario no encontrado" })


        if (newRole === "USER") user[0].role = "user"
        if (newRole === "PREMIUM") user[0].role = "premium"

        const status = await userManager.update(user[0], { _id: _id })

        if (status.acknowledged) return res.send({ status: "ok", message: "ROL Cambiado correctamente" })

    }

    catch (e) {
        req.status(500).send({ message: "error del servidor" })
    }
}


export const userDelete = async (req, res) => {

    try {
        const { _id } = req.params

        const user = await userManager.findOne({ _id: _id })

        if (!user) return req.status(401).send({ message: "Usuario no encontrado" })

        const status = await userManager.deleteUser({ _id: _id })

        if (status.acknowledged) return res.send({ status: "ok", message: `Usuario ID: ${_id} eliminado` })

    }
    catch (e) {
        req.status(500).send({ message: "error del servidor" })
    }


}

export const githubRedirect = async (req, res) => {

    res.render('githubCheck')

}

