import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: [
    'http://localhost:3000',
    'https://be-myforce.in',
    'https://www.be-myforce.in',
    'https://145.223.18.239', 
    'http://145.223.18.239',
    'http://145.223.18.239:3000',
    process.env.FRONTEND_URL!
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
