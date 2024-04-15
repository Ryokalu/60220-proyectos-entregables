import passport from 'passport'
import passportLocal from 'passport-local'
import passportGithub from 'passport-github2'
import jwtStrategy, { ExtractJwt } from 'passport-jwt'

import userProvider from '../dao/db/user.services.js'
import cartServices from '../dao/db/cart.services.js'
import { passwordHash, validpass, KEY } from '../utils.js'

const jwtStrat = jwtStrategy.Strategy
const Extract = jwtStrategy.ExtractJwt


const userManager = new userProvider()
const cartManager = new cartServices()
const localStrategy = passportLocal.Strategy

const initPassport = () => {

    passport.use('jwt', new jwtStrat(
        {
            jwtFromRequest: Extract.fromExtractors([getCookie]),
            secretOrKey: KEY
        },
        async (jwtPayload, done) => {
            try {
                return (done(null, jwtPayload.user))
            }
            catch (e) {
                return (e)
            }
        }
    ))



    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },

        async (req, username, pass, done) => {
            const { first_name, last_name, email, age } = req.body
            console.log(email)
            try {
                const valid = await userManager.findOne({ 'email': email })
                console.log(valid)
                if (!valid) {

                    return done(null, false)
                }
                const cart = await cartManager.createCart()

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: passwordHash(pass),
                    loggedMethod: "local",
                    cart: cart._id
                }

                const result = await userManager.createrUser(newUser)
                return done(null, result)
            }
            catch (e) {
                return done("Error al registrar: " + e)
            }
        }
    ))

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },

        async (req, username, password, done) => {
            try {

                const user = await userManager.findOne({ email: username })

                if (user.length === 0) return done(null, false)
                if (!validpass(user, password)) return done(null, false)
                return done(null, user[0])
            }
            catch (e) {
                return done(e)
            }
        }

    ))


    passport.serializeUser((user, done) => {
        console.log(user)
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userManager.findOne({ "_id": id })
            done(null, user)
        }
        catch (e) {
            console.error("Error deseralizando usuario" + e)
        }
    })

    passport.use('github', new passportGithub(
        {
            clientID: 'Iv1.acc94e6a881b8fcb', //Agregar CLIENTID
            clientSecret: '48f79d3e2a280253568f9fcafedc6387b45aaac2', //Agregar SECRET
            callbackUrl: 'http://localhost:8080/user/githubCallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await userManager.findOne({ email: profile._json.email })

                if (user.length !== 0) return done(null, user[0])

                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email: profile._json.email,
                    password: '',
                    loggedMethod: "github"
                }
                const status = await userManager.createrUser(newUser)
                return done(null, status)
            }
            catch (e) {
                console.log(e)
                return done(e)
            }
        }
    ))
}

const getCookie = req => {
    let token = null
    if (req && req.cookies) token = req.cookies['jwtCookieToken']
    return token
}

export default initPassport