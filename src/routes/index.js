import { Router } from 'express';
import serverMiddlewareError from '../middlewares/serverMiddlewareError.js';
import postsRouter from './postsRouter.js';
import userRouter from './userRouter.js';

const router = Router();
router.use(postsRouter)

router.use(userRouter);
router.use(postsRouter);

router.use(serverMiddlewareError);

export default router;
