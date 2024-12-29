import { Types } from 'mongoose';
import Asset from '@/models/asset.model';
import {
  singleFileUpload,
  multiFileUpload,
  deleteSingleUpload,
  deleteMultipleUpload,
} from '@/utils/cloudinary.util';
import logger from '@/utils/logger.util';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  size?: number;
}

// interface FileWithMetadata extends UploadedFile {
//   // size?: number;
//   duration?: number;
// }

interface CreateAssetParams {
  file: UploadedFile;
  userId: Types.ObjectId;
  relatedModel: 'Achievement' | 'User';
  relatedId: Types.ObjectId;
  folder: string;
  duration?: number; // Optional, only for videos
}

interface CreateMultipleAssetsParams {
  files: UploadedFile[];
  videoDuration?: number; // Single duration for the one allowed video
  userId: Types.ObjectId;
  relatedModel: 'Achievement' | 'User';
  relatedId: Types.ObjectId;
  folder: string;
}

export const createAsset = async ({
  file,
  userId,
  relatedModel,
  relatedId,
  folder,
  duration,
}: CreateAssetParams) => {
  try {
    const uploadResult = await singleFileUpload(file, { folder });
    const isVideo = uploadResult.asset_type === 'video';

    const assetData = {
      user: userId,
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      asset_type: isVideo ? 'video' : 'image',
      related_model: relatedModel,
      related_id: relatedId,
      size: file.size,
      ...(isVideo && duration && { duration })
    };

    const asset = await Asset.create(assetData);
    return asset;
  } catch (error) {
    logger.error('Asset creation error:', error);
    throw error;
  }
};

export const createMultipleAssets = async ({
  files,
  videoDuration,
  userId,
  relatedModel,
  relatedId,
  folder,
}: CreateMultipleAssetsParams) => {
  try {
    const uploadResults = await multiFileUpload(files, { folder });

    const assets = await Asset.insertMany(
      uploadResults.map((result, index) => {
        const isVideo = result.asset_type === 'video';
        return {
          user: userId,
          url: result.url,
          public_id: result.public_id,
          asset_type: isVideo ? 'video' : 'image',
          related_model: relatedModel,
          related_id: relatedId,
          size: files[index].size,
          ...(isVideo && videoDuration && { duration: videoDuration })
        };
      }),
    );

    return assets;
  } catch (error) {
    logger.error('Multiple assets creation error:', error);
    throw error;
  }
};

export const deleteAsset = async (assetId: Types.ObjectId) => {
  try {
    const asset = await Asset.findById(assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    await deleteSingleUpload(asset.public_id);
    await asset.deleteOne();

    return { message: 'Asset deleted successfully' };
  } catch (error) {
    logger.error('Asset deletion error:', error);
    throw error;
  }
};

export const deleteUserAssets = async (userId: Types.ObjectId) => {
  try {
    const assets = await Asset.find({ user: userId });
    if (assets.length === 0) return;

    const publicIds = assets.map((asset) => asset.public_id);
    await deleteMultipleUpload(publicIds);
    await Asset.deleteMany({ user: userId });

    return { message: 'All user assets deleted successfully' };
  } catch (error) {
    logger.error('User assets deletion error:', error);
    throw error;
  }
};
