import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { ErrorHandler } from '@/helpers/error';
import Achievement from '@/models/achievement.model';
import { createMultipleAssets } from '@/services/asset.service';
import { processVideo } from '@/utils/video.util';
import { Types } from 'mongoose';
import { z } from 'zod';
import User from '@/models/user.model';

// Define Zod schema for achievement creation
const createAchievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().refine((data) => {
    try {
      JSON.parse(data); // Ensure it's valid stringified JSON
      return true;
    } catch {
      return false;
    }
  }, 'Invalid stringified JSON format'),
  interests: z.array(z.string()).min(1, 'At least one interest is required'),
});

export const createAchievement = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, interests } = req.body;
    // Validate request body
    const result = createAchievementSchema.safeParse({
      title,
      description,
      interests: Array.isArray(interests) ? interests : [interests],
    });

    if (!result.success) {
      const error = result.error.errors[0];
      return next(
        new ErrorHandler(400, 'Validation failed', {
          field: error.path.join('.'),
          message: error.message,
        }),
      );
    }

    const files = req.files as Express.Multer.File[];
    // Validate file count
    if (files?.length > 10) {
      return next(new ErrorHandler(400, 'Maximum 10 files are allowed'));
    }

    // Validate video count
    const videoFiles = files?.filter((file) => file.mimetype.startsWith('video/')) || [];
    if (videoFiles.length > 1) {
      return next(new ErrorHandler(400, 'Only one video is allowed per achievement'));
    }

    // Check if all interests exist in user's interest list first
    const user = await User.findById(req.user?._id as Types.ObjectId);
    const invalidInterests = result.data.interests.filter(
      (interest) =>
        !user?.interests.some((userInterest) => userInterest.toString() === interest.toString()),
    );

    if (invalidInterests.length > 0) {
      return next(new ErrorHandler(400, "Some interests are not in user's interest list"));
    }

    // Create achievement first
    const achievement = await Achievement.create({
      user: req.user?._id,
      title: result.data.title,
      description: result.data.description,
      interests: result.data.interests.map((id) => new Types.ObjectId(id)),
      status: 'pending',
    });

    // Handle file uploads if any
    if (files?.length > 0) {
      // Find video file if exists
      const videoFile = files.find((file) => file.mimetype.startsWith('video/'));
      let videoDuration: number | undefined;

      // Get video duration if video exists
      if (videoFile) {
        const { buffer, duration } = await processVideo(videoFile);
        videoFile.buffer = buffer; // Replace with compressed version
        videoFile.size = buffer.length;
        videoDuration = duration;
      }

      // Upload all files and create assets
      await createMultipleAssets({
        files,
        videoDuration,
        userId: req.user?._id as Types.ObjectId,
        relatedModel: 'Achievement',
        relatedId: achievement._id as Types.ObjectId,
        folder: `achievements/${achievement._id}`,
      });
    }

    // Fetch complete achievement with assets and interests
    const completeAchievement = await Achievement.findById(achievement._id)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image');

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully and pending approval',
      data: completeAchievement,
    });
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const query: any = {};

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // If not admin, only show approved achievements
    if (req.user?.user_type !== 'admin') {
      query.status = 'approved';
    }

    // Fetch one extra item to determine if there's a next page
    const achievements = await Achievement.find(query)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit + 1); // Fetch one extra

    // Check if we have more items
    const hasNextPage = achievements.length > limit;

    // Remove the extra item if it exists
    const items = hasNextPage ? achievements.slice(0, -1) : achievements;

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        hasNextPage,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAchievement = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image');

    if (!achievement) {
      throw new ErrorHandler(404, 'Achievement not found');
    }

    // If not approved, only owner and admin can view
    if (
      achievement.status !== 'approved' &&
      req.user?.user_type !== 'admin' &&
      achievement.user.toString() !== req.user?._id.toString()
    ) {
      throw new ErrorHandler(403, 'Not authorized to view this achievement');
    }

    res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};
