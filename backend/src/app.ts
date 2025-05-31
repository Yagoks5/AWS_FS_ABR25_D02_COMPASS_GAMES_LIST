import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import platformRoutes from './routes/platformRoutes';
import gameRoutes from './routes/gameRoutes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/platforms', platformRoutes);
app.use('/games', gameRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
