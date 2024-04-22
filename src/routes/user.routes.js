import { Router } from "express";
// import userProvider from "../services/user.services.js";//
import passport from "passport";
// import { tokenGenerator, validpass } from '../utils.js'//
import { authToken } from "../utils.js";

//////

import {
    WEB_LOGIN,
    WEB_REGISTER,
    user_register_post,
    user_login_post,
    user_logout_get,
    user_register_fail,
    user_login_fail,
    githubCallback_authenticate,
    github_authenticate,
    current_user_id,
    render_User
} from '../controllers/user.controller.js'

const router = Router()


router.get('/login', WEB_LOGIN)
router.get('/register', WEB_REGISTER)
router.post("/user/register", passport.authenticate('register', { failureRedirect: '/user/fallo-registro' }), user_register_post)
router.post("/user/login", user_login_post)
router.get('/user/logout', user_logout_get)
router.get("/user/fallo-registro", user_register_fail)
router.get("/user/fallo-login", user_login_fail)
router.get('/user/githubCallback', passport.authenticate('github', { failureRedirect: '/github/error' }), githubCallback_authenticate)
router.get('/user/github', passport.authenticate('github', { scope: ['user:email'] }), github_authenticate)
router.get('/user/current/:userId', authToken, current_user_id)
router.get('/user/current/', render_User)

export default router


