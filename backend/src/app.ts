import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
import corsOptions from '@config/cors.config';

dotenv.config({ path: path.join(__dirname, '../.env') });
import { handleError } from '@helpers/error';
import httpLogger from '@middlewares/httpLogger';
import router from '@routes/index';
import authRoutes from '@routes/auth.routes';
import verificationRoutes from '@routes/verification.routes';
import { connectDB } from '@utils/db.util';
import logger from '@utils/logger.util';
import onboardingRoutes from '@/routes/onboarding.routes';
import masterRoutes from '@/routes/master.routes';
import achievementRoutes from '@/routes/achievement.routes';
import needRoutes from '@/routes/need.routers';
import { errorMiddleware } from './middlewares/error.middleware';
import { initializeCronJobs } from '@utils/cron.util';
const app: express.Application = express();

// Apply CORS before other middleware
app.use(cors(corsOptions));

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Remove /api prefix from incoming requests
app.use((req, _res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace('/api', '');
  }
  next();
});

app.use('/', router);
app.use('/auth', authRoutes);
app.use('/verification', verificationRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/master', masterRoutes);
app.use('/achievements', achievementRoutes);
app.use('/needs', needRoutes);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// Add the custom error middleware first
app.use(errorMiddleware);

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res, next) => {
  // Log the error stack for debugging
  console.error('Error Stack:', err.stack);

  // Make sure headers haven't been sent
  if (res.headersSent) {
    return next(err);
  }

  handleError(err, res);
};

// Register error handler last
app.use(errorHandler);

const port = process.env.PORT || '8000';
app.set('port', port);

const server = http.createServer(app);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
}

// Connect to MongoDB and start server only after successful connection
connectDB()
  .then(() => {
    // Initialize cron jobs after DB connection is established
    initializeCronJobs();

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
