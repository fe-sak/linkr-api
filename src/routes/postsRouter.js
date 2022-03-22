import { Router } from "express";
import { postPosts } from "../controllers/postsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";

const postRouter = Router();

postRouter.post('/posts', validateSchemaMiddleware(postSchema), postPosts); //missing token

export default postRouter;