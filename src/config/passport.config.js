import passport from 'passport'
import passportLocal from 'passport-local'
import passportGithub from 'passport-github2'
import jwtStrategy, { ExtractJwt } from 'passport-jwt'

import userProvider from '../services/user.services.js'
import cartServices from '../services/cart.services.js'
import { passwordHash, validpass, KEY, hostname } from '../utils.js'

import configEnv from "../config/env/config.js"

import CustomError from "../services/errors/customError.js";
import { createUserError, loginUserError, deleteUserError } from "../services/errors/messages/user.errors.js";



const jwtStrat = jwtStrategy.Strategy
const Extract = jwtStrategy.ExtractJwt


const userManager = new userProvider()
const cartManager = new cartServices()
const localStrategy = passportLocal.Strategy


const link = `${hostname.protocol}://${hostname.host}`
const callback = `${link}/user/githubCallback`

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

            try {

                if (!first_name, !last_name, !email, !age, !pass) {

                    CustomError.createError({
                        user: "Creacion de usuario",
                        cause: createUserError({ first_name, last_name, email, age, pass }),
                        message: "ocurrio un error al crear el usuario"
                    })

                    return done(null, false)

                }

                const valid = await userManager.findOne({ 'email': email })

                if (valid.length === 1) {

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
            clientID: configEnv.clientId,
            clientSecret: configEnv.secretId,
            callbackUrl: callback
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await userManager.findOne({ email: profile._json.email })



                if (user.length !== 0) return done(null, user[0])

                const userConnectionTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`

                const cart = await cartManager.createCart()

                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email: profile._json.email,
                    password: '',
                    loggedMethod: "github",
                    cart: cart._id
                }

                newUser.last_connection = userConnectionTime
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