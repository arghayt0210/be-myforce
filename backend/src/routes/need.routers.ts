import express from 'express';
import {
  isAuthenticated,
  isEmailVerified,
  isOnboarded,
  isAdmin,
} from '@/middlewares/auth.middleware';
import { uploadMultiple } from '@/middlewares/upload.middleware';
import {
  createNeed,
  getNeeds,
  getNeed,
  updateNeedApproval,
  markAsFulfilled,
} from '@/controllers/need.controller';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  isEmailVerified,
  isOnboarded,
  uploadMultiple.array('files', 10),
  createNeed,
);
router.get('/', isAuthenticated, isEmailVerified, isOnboarded, getNeeds);
router.get('/:id', isAuthenticated, isEmailVerified, isOnboarded, getNeed);
router.patch('/:id/approval', isAuthenticated, isAdmin, updateNeedApproval);
router.patch('/:id/fulfill', isAuthenticated, isEmailVerified, isOnboarded, markAsFulfilled);

export default router;
