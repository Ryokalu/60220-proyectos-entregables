import passport from 'passport'
import passportLocal from 'passport-local'
import passportGithub from 'passport-github2'

import userProvider from '../dao/db/user.services.js'
import { passwordHash, validpass } from '../utils.js'


const userManager = new userProvider()
const localStrategy = passportLocal.Strategy

const initPassport = () => {
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
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: passwordHash(pass),
                    loggedMethod: "local"
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
            clientID: '', //Agregar CLIENTID
            clientSecret: '', //Agregar SECRET
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

export default initPassport