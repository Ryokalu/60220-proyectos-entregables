import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const passwordHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const validpass = (user, pass) => { return bcrypt.compareSync(pass, user.password) }
export default __dirname;

export const KEY = '3ST4CL4V3P0D3R0S4'

export const tokenGenerator = (user) => { return jwt.sign({ user }, KEY, { expiresIn: '240s' }) }

export const authToken = (req, res, next) => {
    const header = req.headers.authorization
    console.log(header)
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
        if (req.user.role !== role) return res.status(403).send("No tienes permisos para ver este contenido")
        next()
    }


}

// export const authorization = () => {
//     return async (req, res, next) => {
//         console.log(req.user.role)
//         // console.log(req)
//         // if (req.user.role === "admin") res.render('editProd') //aplicar la vista a redirigir en caso de ser admin
//         // if (req.user.role === "user") res.render('products')
//         next()
//     }
// }

// export const check = (role) => {
//     return async (req, res, next) => {
//         console.log("req")
//         if (req.user.role !== role) return res.status(403).send("No estas autorizado para ver este contenido")
//         if (!req.user) return res.status(401).send("su cuenta cerro sesion, por favor vuelva a logearse")
//         next()
//     }

// }


