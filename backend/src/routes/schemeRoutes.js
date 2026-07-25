import { Router } from 'express';
import schemeController from '../controllers/schemeController.js';

const router = Router();

router.get('/', schemeController.getSchemes);

export default router;
