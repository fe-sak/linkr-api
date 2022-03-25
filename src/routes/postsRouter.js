import { Router } from "express";
import { getHashtag, postByHashtag, postPosts, readPosts } from "../controllers/postsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";
import { auth } from '../middlewares/authMiddleware.js';

const postsRouter = Router();

postsRouter.get('/posts', auth, readPosts);

postsRouter.post('/posts', validateSchemaMiddleware(postSchema), auth, postPosts);

postsRouter.get('/hashtag', getHashtag);

postsRouter.get('hashtag/:hashtag', postByHashtag);

export default postsRouter;
