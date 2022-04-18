import { Router } from 'express';
import { getFollows, teste } from '../controllers/followsController.js';
import { auth } from '../middlewares/authMiddleware.js';

const followsRouter = Router();

followsRouter.get('/follows', auth, getFollows);

followsRouter.get('/postrepost', auth, teste); // query teste

export default followsRouter;
