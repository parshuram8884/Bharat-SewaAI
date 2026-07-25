import { Router } from 'express';
import ocrController from '../controllers/ocrController.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post('/upload', upload.single('document'), ocrController.uploadAndExtract);
router.get('/supported-docs', ocrController.getSupportedDocs);

export default router;
