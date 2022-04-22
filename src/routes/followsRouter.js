import { Router } from 'express';
import { getFollows } from '../controllers/followsController.js';
import { auth } from '../middlewares/authMiddleware.js';

const followsRouter = Router();

followsRouter.get('/follows', auth, getFollows);

export default followsRouter;
