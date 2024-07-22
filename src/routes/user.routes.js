import { Router } from "express";
// import userProvider from "../services/user.services.js";//
import passport from "passport";
// import { tokenGenerator, validpass } from '../utils.js'//
import { authToken, authorization, uploader, uploaderArray } from "../utils.js";

// import { check } from "../utils.js";

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
    render_User,
    render_administrator,
    valid_admin,
    get_User,
    valid_user,
    user_pass_recover,
    user_change_role,
    userUploadDoc,
    findAllUser,
    deleteUsersByTime,
    UserEditAdmin,
    isAdminOK,
    adminRole,
    userDelete,
    githubRedirect,
} from '../controllers/user.controller.js'

const router = Router()

router.get('/api/user/:id', get_User)
router.get('/login', WEB_LOGIN)
router.get('/register', WEB_REGISTER)
router.post("/user/register", passport.authenticate('register', { failureRedirect: '/user/fallo-registro' }), user_register_post)
router.post("/user/login", user_login_post)
router.post('/user/logout', user_logout_get)
router.get("/user/fallo-registro", user_register_fail)
router.get("/user/fallo-login", user_login_fail)
router.get('/user/githubCallback', passport.authenticate('github', { failureRedirect: '/github/error' }), githubCallback_authenticate)
router.get('/user/github', passport.authenticate('github', { scope: ['user:email'] }), github_authenticate)
router.get('/user/current/:userId', authToken, authorization(["user"]), current_user_id)
router.get('/user/current/', render_User)
router.get('/user/administrator', render_administrator)
router.get('/admin/validator', authToken, authorization(["admin", "premium"]), valid_admin)
router.get('/api/user/validator/:id', valid_user)
router.get('/user/recover', user_pass_recover)
router.post('/api/user/premium/:_id', uploaderArray.array("files", 3), user_change_role)
router.post('/api/user/:_id/documents', uploader.single('file'), userUploadDoc)

router.get('/api/users/', findAllUser)
router.delete('/api/users', deleteUsersByTime)

router.get('/user/admin/', authToken, authorization(["admin"]), isAdminOK)
router.get('/user/administrator/user', UserEditAdmin)
router.post('/user/admin/role/:_id', authToken, authorization(["admin"]), adminRole)

router.delete('/api/user/:_id', authToken, authorization(["admin"]), userDelete)

router.get('/github/redirect', githubRedirect)






export default router


