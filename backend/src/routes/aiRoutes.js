import { Router } from 'express';
import aiController from '../controllers/aiController.js';

const router = Router();

router.post('/message', aiController.handleMessage);

export default router;
