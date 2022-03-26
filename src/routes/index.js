import { Router } from 'express';
import serverMiddlewareError from '../middlewares/serverMiddlewareError.js';
import postsRouter from './postsRouter.js';
import userRouter from './userRouter.js';
import likeRouter from './likeRouter.js';

const router = Router();

router.use(userRouter);
router.use(postsRouter);
router.use(likeRouter);

router.use(serverMiddlewareError);

export default router;
