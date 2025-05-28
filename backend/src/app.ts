import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Remove /api prefix since we're handling it in the frontend proxy
app.use('/', authRoutes);

export default app;
