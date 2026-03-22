import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  base: {
    service: 'compass-games-backend',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
