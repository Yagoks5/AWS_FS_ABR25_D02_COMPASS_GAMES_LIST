import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import platformRoutes from './routes/platformRoutes';
import gameRoutes from './routes/gameRoutes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import dashboardRoutes from './routes/dashboardRoutes';
import { httpLogger } from './middleware/httpLogger.middleware';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(httpLogger);

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
