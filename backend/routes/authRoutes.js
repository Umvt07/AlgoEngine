import express from 'express';
import { cfLogin, cfCallback, logout } from '../controllers/auth.js'; // Adjust path if needed
import { protect } from '../middleware/auth.js';
const router = express.Router();


router.get('/cf', cfLogin);
router.get('/callback', cfCallback);
router.post('/logout', logout);

router.get('/me', protect, (req, res) => {
  res.json({ h: req.user.h, mxR: req.user.mxR });
});
export default router;