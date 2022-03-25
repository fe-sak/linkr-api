import { Router } from 'express';
import * as likeController from '../controllers/likeController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/posts/:id/like', auth, likeController.likeThePost);
router.delete('/posts/:id/like', auth, likeController.dislikeThePost);

export default router;
