import { Router } from 'express';
import { readPosts } from '../controllers/postsController.js';
import { auth } from '../middlewares/authMiddleware.js';

const postsRouter = Router();

postsRouter.get('/posts', auth, readPosts);

export default postsRouter;
