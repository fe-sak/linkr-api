import { Router } from 'express';
import serverMiddlewareError from '../middlewares/serverMiddlewareError.js';
import postsRouter from './postsRouter.js';
import userRouter from './userRouter.js';
import likeRouter from './likeRouter.js';
import repostsRouter from './repostsRouter.js';

const router = Router();

router.use(userRouter);
router.use(postsRouter);
router.use(likeRouter);
router.use(repostsRouter);

router.use(serverMiddlewareError);

export default router;
