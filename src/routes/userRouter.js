import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchemaMiddleware.js';
import { loginSchema, signUpSchema } from '../schemas/userSchema.js';

const router = Router();

router.post('/users', validateSchemaMiddleware(signUpSchema), userController.signUp);
router.post('/users/login', validateSchemaMiddleware(loginSchema), userController.login);
router.delete('/users/logout', auth, userController.logout);
router.get('/users/:id', userController.getById)

export default router;
