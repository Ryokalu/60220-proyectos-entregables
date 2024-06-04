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
            to: configEnv.gmailAccount,
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

    sendRecoverEmail = async (data) => {

        const mailOptions = {
            from: configEnv.gmailAccount,
            to: configEnv.gmailAccount,
            subject: "PRUEBA --- Recuperacion de tu contraseña",
            html: `Ha solicitado una recuperacion de la constraseña                
                enlace: http://localhost:8080/recover/${data.recoverID}
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
}

export default emailSender

