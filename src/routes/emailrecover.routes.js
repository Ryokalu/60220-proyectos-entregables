import { Router } from "express";

import { CreateEmailRecoverID, recoverEmail, passwordUpdate } from "../controllers/emailRecover.controller.js";

const router = Router()


router.post('/', CreateEmailRecoverID)
router.get('/:uuid', recoverEmail)
router.post('/passwordCheck', passwordUpdate)

export default router