import express from 'express';
import { createAchievement } from '@/controllers/achievement.controller';
import { isAuthenticated, isEmailVerified, isOnboarded } from '@/middlewares/auth.middleware';
import { uploadMultiple } from '@/middlewares/upload.middleware';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  isEmailVerified,
  isOnboarded,
  uploadMultiple.array('files', 10), // Max 10 files
  createAchievement,
);

export default router;
