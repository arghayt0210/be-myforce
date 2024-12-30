import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { ErrorHandler } from '@/helpers/error';
import Need from '@/models/need.model';
import { createMultipleAssets } from '@/services/asset.service';
import { processVideo } from '@/utils/video.util';
import { Types } from 'mongoose';
import { z } from 'zod';
import User from '@/models/user.model';

const createNeedSchema = z.object({
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
  event_date: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Event date must be in the future',
  }),
});

export const createNeed = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, interests, event_date } = req.body;

    const result = createNeedSchema.safeParse({
      title,
      description,
      interests: Array.isArray(interests) ? interests : [interests],
      event_date,
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
    if (files?.length > 10) {
      return next(new ErrorHandler(400, 'Maximum 10 files are allowed'));
    }

    const videoFiles = files?.filter((file) => file.mimetype.startsWith('video/')) || [];
    if (videoFiles.length > 1) {
      return next(new ErrorHandler(400, 'Only one video is allowed per need post'));
    }

    // Validate user interests
    const user = await User.findById(req.user?._id as Types.ObjectId);
    const invalidInterests = result.data.interests.filter(
      (interest) =>
        !user?.interests.some((userInterest) => userInterest.toString() === interest.toString()),
    );

    if (invalidInterests.length > 0) {
      return next(new ErrorHandler(400, "Some interests are not in user's interest list"));
    }

    // Create need post
    const need = await Need.create({
      user: req.user?._id,
      title: result.data.title,
      description: result.data.description,
      interests: result.data.interests.map((id) => new Types.ObjectId(id)),
      event_date: new Date(result.data.event_date),
      is_approved: 'pending',
      status: 'searching',
    });

    // Handle file uploads
    if (files?.length > 0) {
      const videoFile = files.find((file) => file.mimetype.startsWith('video/'));
      let videoDuration: number | undefined;

      if (videoFile) {
        const { buffer, duration } = await processVideo(videoFile);
        videoFile.buffer = buffer;
        videoFile.size = buffer.length;
        videoDuration = duration;
      }

      await createMultipleAssets({
        files,
        videoDuration,
        userId: req.user?._id as Types.ObjectId,
        relatedModel: 'Need',
        relatedId: need._id as Types.ObjectId,
        folder: `needs/${need._id}`,
      });
    }

    const completeNeed = await Need.findById(need._id)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image');

    res.status(201).json({
      success: true,
      message: 'Need post created successfully',
      data: completeNeed,
    });
  } catch (error) {
    next(error);
  }
};

export const getNeed = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const need = await Need.findById(req.params.id)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image');

    if (!need) {
      throw new ErrorHandler(404, 'Need post not found');
    }

    res.status(200).json({
      success: true,
      data: need,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNeedApproval = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.user?.user_type !== 'admin') {
      throw new ErrorHandler(403, 'Only administrators can approve or reject needs');
    }

    const { id } = req.params;
    const { is_approved, rejection_reason } = req.body;

    if (!['approved', 'rejected'].includes(is_approved)) {
      throw new ErrorHandler(400, 'Invalid approval status');
    }

    if (is_approved === 'rejected' && !rejection_reason) {
      throw new ErrorHandler(400, 'Rejection reason is required');
    }

    const need = await Need.findById(id);
    if (!need) {
      throw new ErrorHandler(404, 'Need not found');
    }

    if (need.is_approved !== 'pending') {
      throw new ErrorHandler(400, 'Can only approve or reject pending needs');
    }

    need.is_approved = is_approved;
    if (is_approved === 'rejected') {
      need.rejection_reason = rejection_reason;
    }

    await need.save();

    const updatedNeed = await Need.findById(id)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image');

    res.status(200).json({
      success: true,
      message: `Need ${is_approved} successfully`,
      data: updatedNeed,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsFulfilled = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const need = await Need.findById(id);

    if (!need) {
      throw new ErrorHandler(404, 'Need not found');
    }

    if (need.user.toString() !== req.user?._id.toString()) {
      throw new ErrorHandler(403, 'Only the creator can mark a need as fulfilled');
    }

    if (need.is_approved !== 'approved' || need.status !== 'searching') {
      throw new ErrorHandler(400, 'Only approved and searching needs can be marked as fulfilled');
    }

    need.status = 'fulfilled';
    await need.save();

    const updatedNeed = await Need.findById(id)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image');

    res.status(200).json({
      success: true,
      message: 'Need marked as fulfilled successfully',
      data: updatedNeed,
    });
  } catch (error) {
    next(error);
  }
};

export const getNeeds = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const approvalStatus = req.query.is_approved as string;

    const query: any = {};

    // Handle approval status
    if (approvalStatus) {
      query.is_approved = approvalStatus;
    } else if (req.user?.user_type !== 'admin') {
      // Non-admin users can only see approved needs
      query.is_approved = 'approved';
    }

    // Handle need status
    if (status) {
      query.status = status;
    }

    // By default, show searching needs that haven't expired
    if (!status) {
      query.status = 'searching';
      query.event_date = { $gt: new Date() };
    }

    const needs = await Need.find(query)
      .populate('assets')
      .populate('interests')
      .populate('user', 'full_name username profile_image')
      .sort({ event_date: 1 })
      .skip((page - 1) * limit)
      .limit(limit + 1);

    const hasNextPage = needs.length > limit;
    const items = hasNextPage ? needs.slice(0, -1) : needs;

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
