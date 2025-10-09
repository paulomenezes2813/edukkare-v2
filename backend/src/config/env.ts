import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: (process.env.JWT_SECRET || 'edukkare-secret-key-2025') as string,
  jwtExpiration: (process.env.JWT_EXPIRATION || '7d') as string,
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
};

