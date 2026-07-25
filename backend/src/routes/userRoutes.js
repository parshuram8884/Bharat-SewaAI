import { Router } from 'express';
import userController from '../controllers/userController.js';
import requireAuth from '../middlewares/auth.js';

const router = Router();

router.post('/sync', requireAuth, userController.syncProfile);
router.get('/profile', requireAuth, userController.getProfile);

export default router;
