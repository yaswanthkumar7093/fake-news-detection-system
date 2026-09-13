import express from 'express';
import { detectFakeNews, getHistory, getStats } from '../controllers/detectController.js';

const router = express.Router();

router.post('/analyze', detectFakeNews);
router.get('/history', getHistory);
router.get('/stats', getStats);

export default router;
