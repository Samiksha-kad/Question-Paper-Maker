import express from 'express';

const router = express.Router();
import { login, register } from '../controller/UserController.js'
import { upload } from '../middleware/multer.js';

router.route("/registerService").post(upload.single('profile'), register)
router.post("/loginService", login)


export default router