import nodemailer from 'nodemailer'
import configEnv from "../config/env/config.js"


const trans = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: configEnv.gmailAccount,
        pass: configEnv.gmailpass
    }
})


trans.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('the server is waiting for new messages');
    }
})





class emailSender {
    constructor() { }

    sendEmail = async (data) => {

        const mailOptions = {
            from: configEnv.gmailAccount,
            to: data.purchaser,
            subject: "Prueba de confirmacion de compra",
            html: `<div> Su compra fue realizado con exito
                fecha: ${data.purchase_dateTime}
                cantidad: ${data.amount}
                correo: ${data.purchaser}   
            </div>`
        }


        trans.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return "error"
            }
            return "success"
        })
    }

    sendRecoverEmail = async (data, email, protocol, hostname) => {

        const link = `${protocol}://${hostname}`

        const mailOptions = {
            from: configEnv.gmailAccount,
            to: email,
            subject: "PRUEBA --- Recuperacion de tu contraseña",
            html: `Ha solicitado una recuperacion de la constraseña                
                enlace: ${link}/recover/${data.recoverID}
                <br>
                RECORDATORIO: el periodo de validez para cambiar la contraseña es de una hora            
            `
        }

        trans.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return "error"
            }
            return "success"
        })
    }

    massEmailDeleted = async (email) => {

        const mailOptions = {
            from: configEnv.gmailAccount,
            to: email,
            subject: ` Prueba ---- Aviso de su cuenta`,
            html: `Su cuenta ${email} en nuestro sitio  ha sido eliminada debido a inactividad`
        }

        trans.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return "error"
            }
            return "success"
        })
    }

    deleteProdEmail = async (title) => {

        const mailOptions = {
            from: configEnv.gmailAccount,
            to: configEnv.gmailAccount,
            subject: ` Producto Eliminado`,
            html: ` su producto registrado como "${title}" fue eliminado de nuestro sistema, lamentamos esta situacion `
        }

        trans.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return "error"
            }
            return "success"
        })

    }


}

export default emailSender

