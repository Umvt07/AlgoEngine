import express from 'express';
import { protect } from '../middleware/auth.js';
import { askCoach } from '../controllers/userController.js';

const router = express.Router();

router.post('/coach', protect, askCoach);

export default router;