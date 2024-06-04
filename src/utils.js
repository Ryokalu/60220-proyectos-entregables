import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { faker } from "@faker-js/faker"
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const passwordHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const validpass = (user, pass) => { return bcrypt.compareSync(pass, user.password) }
export default __dirname;

export const KEY = '3ST4CL4V3P0D3R0S4'

export const tokenGenerator = (user) => { return jwt.sign({ user }, KEY, { expiresIn: '240s' }) }

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
        // console.log(strategy)
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


        // for (let i = 0; i < role.length; i++) {
        //     console.log(req.user.role !== role[i])
        //     if (req.user.role !== role[i]) {
        //         valid = true                
        //     }
        // }

        // if (valid) return res.status(403).send("No tienes permisos para ver este contenido")

        // next()
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

