import { Router } from 'express';
import { postPosts, readPosts } from '../controllers/postsController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchemaMiddleware.js';
import postSchema from '../schemas/postSchema.js';

const postsRouter = Router();

postsRouter.get('/posts', readPosts);

postsRouter.post('/posts', validateSchemaMiddleware(postSchema), postPosts); //missing token

export default postsRouter;
