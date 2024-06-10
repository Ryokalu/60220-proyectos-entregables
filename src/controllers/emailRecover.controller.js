import emailRecoverProvider from "../services/emailRecover.services.js";
import userProvider from "../services/user.services.js";
import emailSender from "../services/email.services.js";
import { v4 as uuid } from 'uuid'
import { formattedMonth, formattedHours, formattedDay, validpass, passwordHash } from "../utils.js";

const recoverManager = new emailRecoverProvider();
const userManager = new userProvider();
const emailProvider = new emailSender();

export const CreateEmailRecoverID = async (req, res) => {
    try {
        const { email } = req.body


        if (!email) return res.status(401).send("Campos vacios")

        const validEmail = await userManager.findOne({ "email": email })



        if (validEmail.length === 0) return res.status(401).send({ error: "No encontrado", message: "Email no encontrado" })

        let date = new Date()
        let yr = date.getFullYear()
        let month = formattedMonth(date)
        let day = formattedDay(date)

        let hrs = formattedHours(date)
        let min = date.getMinutes().toString()


        const Emailrecover = {
            recoverID: uuid(),
            email: email,
            expiration_date: `${yr}-${month}-${day}T${hrs}:${min}:00Z`,
        }

        const status = await recoverManager.createRecover(Emailrecover)

        console.log(status)

        const emailSendStatus = await emailProvider.sendRecoverEmail(status)

        return res.send({ message: "correo de recuperacion enviado" })


    }
    catch (e) {
        console.log(e)
    }
}

export const recoverEmail = async (req, res) => {
    try {

        let { uuid } = req.params


        const find = await recoverManager.findOne({ "recoverID": uuid })

        if (find.length === 0) return res.redirect("/user/recover")

        let actualDate = new Date()
        let dbDate = new Date(find.expiration_date)

        if (dbDate > actualDate) return res.redirect("/user/recover")

        res.render("passwordupdate")

    }
    catch (e) {
        console.log(e)
    }
}

export const passwordUpdate = async (req, res) => {
    try {

        let { uuid, password } = req.body

        const find = await recoverManager.findOne({ "recoverID": uuid })



        if (find.length === 0) return res.redirect("/user/recover")

        const user = await userManager.findOne({ email: find.email })

        if (user.length === 0) return res.redirect("/user/recover")

        if (validpass(user[0], password)) return res.status(400).send(" no puedes usar la misma contraseña ")


        user[0].password = passwordHash(password)


        let status = await userManager.update(user[0], { "_id": user[0]._id })
        console.log(status)
        if (!status) return res.status(401).send("No se logro actualizar la contraseña")

        return res.send({ success: "Constraseña Actualizada correctamente" })

    }
    catch (e) {
        console.log(e)
    }
}