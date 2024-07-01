import { Router } from "express";

const router = Router()

router.get('/login', (req, res) => {
    res.redirect('/user/github')
})


router.get('/error', (req, res) => {
    res.render("error")
})

export default router