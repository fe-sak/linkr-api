import { Router } from 'express';
import { respost, deleteRepost, getReposts } from '../controllers/repostsController.js';
import { auth } from '../middlewares/authMiddleware.js';

const repostsRouter = Router();

repostsRouter.post('/reposts/:postId', auth, respost)
repostsRouter.delete('/reposts/:postId', auth, deleteRepost)
repostsRouter.get('/reposts/:postId', auth, getReposts)

export default repostsRouter;