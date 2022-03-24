import { Router } from "express";
import { postPosts, readPosts } from "../controllers/postsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";
import { auth } from '../middlewares/authMiddleware.js';

const postsRouter = Router();

postsRouter.get('/posts', auth, readPosts);

postsRouter.post('/posts', validateSchemaMiddleware(postSchema), auth, postPosts);

export default postsRouter;
