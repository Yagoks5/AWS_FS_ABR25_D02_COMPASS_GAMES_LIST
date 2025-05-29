import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

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

export default app;
