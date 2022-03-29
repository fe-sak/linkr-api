import { Router } from 'express';
import { respost, deleteRepost } from '../controllers/repostsController.js';
import { auth } from '../middlewares/authMiddleware.js';

const repostsRouter = Router();

repostsRouter.post('/reposts/:postId', auth, respost)
repostsRouter.delete('/reposts/:postId', auth, deleteRepost)

export default repostsRouter;