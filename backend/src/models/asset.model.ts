import mongoose, { Document } from 'mongoose';

// Update type definitions
type AssetType = 'image' | 'video';
type RelatedModelType = 'Achievement' | 'User';

// Interface for Asset document
interface IAsset extends Document {
  user: mongoose.Types.ObjectId;
  url: string;
  public_id: string;
  asset_type: AssetType;
  related_model: RelatedModelType;
  related_id: mongoose.Types.ObjectId;
  duration?: number; // for videos
  size?: number; // in bytes
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new mongoose.Schema<IAsset>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    asset_type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    related_model: {
      type: String,
      enum: ['Achievement', 'User'],
      required: true,
    },
    related_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'related_model'
    },
    duration: {
      type: Number,
      validate: {
        validator: function(this: IAsset, value: number) {
          // Only validate duration if it's a video and related to Achievement
          if (this.asset_type === 'video' && this.related_model === 'Achievement') {
            return value <= 60; // 60 seconds max
          }
          return true;
        },
        message: 'Video duration must not exceed 60 seconds for achievements'
      }
    },
    size: {
      type: Number,
    }
  },
  { 
    timestamps: true,
  }
);

// Compound index for querying assets by related entity
assetSchema.index({ related_model: 1, related_id: 1 });
assetSchema.index({ user: 1 });

// Validation middleware for Achievement assets
assetSchema.pre('save', async function(next) {
  if (this.related_model === 'Achievement') {
    // Check total size of assets for this achievement
    if (this.isNew) {
      const existingAssets = await mongoose.model('Asset').find({
        related_model: 'Achievement',
        related_id: this.related_id
      });

      const totalSize = existingAssets.reduce((sum, asset) => sum + asset.size, 0) + this.size;
      if (totalSize > 50 * 1024 * 1024) { // 50MB in bytes
        throw new Error('Total size of achievement assets cannot exceed 50MB');
      }

      // Check video count
      if (this.asset_type === 'video') {
        const videoCount = existingAssets.filter(asset => asset.asset_type === 'video').length;
        if (videoCount >= 1) {
          throw new Error('Only one video is allowed per achievement');
        }
      }
    }
  }
  next();
});

const Asset = mongoose.model<IAsset>('Asset', assetSchema);

export default Asset;