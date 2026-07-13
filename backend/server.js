import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { getContestRecommendation, getProb } from './controllers/userController.js'; 
import { cnct } from './config/db.js';
import { protect } from './middleware/auth.js';
import aiRoutes from './routes/aiRoutes.js';
const app = express();
app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONTEND_URL,
  credentials: true 
}));
app.use(cookieParser());
cnct();

app.use('/api/auth', authRoutes);
app.use('/api/ai',aiRoutes);
app.get('/api/users/contest/:handle',protect,getContestRecommendation);
app.get('/api/users/problem/:h',protect, getProb);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Engine running on http://localhost:${PORT}`);
});