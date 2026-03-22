import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './lib/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server is running');
  logger.info(
    { healthUrl: `http://localhost:${PORT}/health` },
    'Health check endpoint',
  );
});
