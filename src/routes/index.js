import { Router } from 'express';
import serverMiddlewareError from '../middlewares/serverMiddlewareError.js';
import userRouter from './userRouter.js';

const router = Router();

router.use(userRouter);


router.use(serverMiddlewareError);

export default router;
