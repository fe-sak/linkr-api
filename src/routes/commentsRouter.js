import { Router } from 'express';
import { createComment } from '../controllers/commentsController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validatePostId } from '../middlewares/validatePostIdMiddleware.js';

const commentsRouter = Router();

commentsRouter.post(
  '/posts/:postId/comments',
  auth,
  validatePostId,
  createComment
);

export default commentsRouter;
