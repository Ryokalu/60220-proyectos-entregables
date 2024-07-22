import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { faker } from "@faker-js/faker"
import { v4 as uuid } from 'uuid';
import multer from 'multer';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export const passwordHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const validpass = (user, pass) => { return bcrypt.compareSync(pass, user.password) }
export default __dirname;

export const KEY = '3ST4CL4V3P0D3R0S4'

export const tokenGenerator = (user) => { return jwt.sign({ user }, KEY, { expiresIn: '240s' }) } // 365d || 240s

export const authToken = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) return res.status(401).send({ error: 'you are not authorized to be here, please re-authenticate.' })

    const token = header.split(' ')[1]
    jwt.verify(token, KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "the token is no valid, please re-authenticate." })
        req.user = credentials.user
        next()
    })
}

export const passCall = (strategy) => {
    return async (req, res, next) => {

        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("user not found in JWT")

        let valid = false

        for (let i = 0; i < role.length; i++) {
            if (req.user.role === role[i]) valid = true
        }

        if (valid) return next()
        else return res.status(403).send("No tienes permisos para ver este contenido")



    }
}



export const generaterProducts = () => {
    let prod = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int(500),
        category: faker.commerce.department(),
        thumbnail: `Imagen/${faker.number.int(500)}`
    }
    prod.status = true
    prod.code = uuid()

    return prod
}


export const formattedMonth = (date) => {
    const month = date.getMonth() + 1; // Sumar 1 porque los meses están indexados desde 0
    return month < 10 ? '0' + month : month.toString(); // Formatear el mes para que tenga dos dígitos
}

export const formattedHours = (date) => {
    const hours = date.getHours() + 1
    return hours < 10 ? '0' + hours : hours.toString();
}

export const formattedDay = (date) => {
    const day = date.getDate()
    return day < 10 ? '0' + day : day.toString();
}



// SOLO UN ARCHIVO
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        const { _id } = req.params

        req.dirnameLocation = ''
        req.fileType = ''

        if (file.mimetype === "image/png") {
            req.dirnameLocation = `${__dirname}/upload/profiles/${_id}/`
            if (!fs.existsSync(req.dirnameLocation)) fs.mkdirSync(req.dirnameLocation, { recursive: true })
            req.fileType = 'profile'
        }

        if (file.mimetype === "application/pdf") {
            req.dirnameLocation = `${__dirname}/upload/documents/${_id}/`
            if (!fs.existsSync(req.dirnameLocation)) fs.mkdirSync(req.dirnameLocation, { recursive: true })
            req.fileType = 'documents'
        }

        if (file.mimetype === "image/jpg") {
            req.dirnameLocation = `${__dirname}/upload/products/${_id}/`
            if (!fs.existsSync(req.dirnameLocation)) fs.mkdirSync(req.dirnameLocation, { recursive: true })
            req.fileType = 'image'
        }

        if (req.dirnameLocation !== '') cb(null, req.dirnameLocation)
        // else res.status(400).send(" tipo de archivo no valido, solo se aceptan archivos .PDF, .JPG y .PDF ")
    },

    filename: function (req, file, cb) {

        cb(null, `${file.originalname}`)
    }
})

export const uploader = multer({
    storage,

    onError: function (e, next) {
        next()
    },
})

// ---- SOLO UN ARCHIVO

//--------------------------//
//--------------------------//
//--------------------------//
//--------------------------//

// VARIOS ARCHIVOS - FILTRO VALIDO PARA PDF

const array = multer.diskStorage({
    destination: function (req, file, cb) {

        const { _id } = req.params

        req.dirnameLocation = `${__dirname}/upload/documents/${_id}/`
        if (!fs.existsSync(req.dirnameLocation)) fs.mkdirSync(req.dirnameLocation, { recursive: true })

        cb(null, req.dirnameLocation)
    },

    filename: function (req, file, cb) {

        cb(null, `${file.originalname}`)
    }
})

// const storageArray = multer({
//     array,

//     onError: function (e, next) {
//         console.log(e)
//         next()
//     },
// })

const validFiles = (req, files, cb) => {
    let fileCorrect = false

    if (files.mimetype === "application/pdf") fileCorrect = true

    req.noValid = fileCorrect;
    if (!fileCorrect) cb(null, false)
    else cb(null, true);
}

export const uploaderArray = multer({
    storage: array,
    fileFilter: validFiles,
    onError: function (e, next) {
        console.log(e)
        next()
    },
})

// ----- VARIOS ARCHIVOS

export let hostname = { host: '', protocol: '' }





// export const dateFormat = (dateStr) => {

//     const [method, date, time] = dateStr.split(" ")
//     const [day, month, year] = date.split("-")
//     const [hours, minutes, seconds] = time.split(":")

//     const userLastConnection = new Date(year, month - 1, day, hours, minutes, seconds)

//     return { 'method': method, 'lastConnection': userLastConnection }

// }