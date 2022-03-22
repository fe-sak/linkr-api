import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchemaMiddleware.js';
import { loginSchema, signUpSchema } from '../validations/userSchema.js';

const router = Router();

router.post('/users', validateSchemaMiddleware(signUpSchema), userController.signUp);
router.post('/users/login', validateSchemaMiddleware(loginSchema), userController.login);

export default router;
