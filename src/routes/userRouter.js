import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchemaMiddleware.js';
import { signUpSchema } from '../validations/userSchema.js';

const router = Router();

router.post('/users', validateSchemaMiddleware(signUpSchema), userController.signUp);

export default router;
