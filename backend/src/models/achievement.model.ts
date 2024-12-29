import mongoose, { Document } from 'mongoose';

// Define achievement status type
type AchievementStatus = 'pending' | 'approved' | 'rejected';

// Interface for Achievement document
interface IAchievement extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: {
    blocks: any[]; // EditorJS data structure
    time: number;
    version: string;
  };
  interests: mongoose.Types.ObjectId[]; // References to Interest model
  likes_count: number;
  comments_count: number;
  status: AchievementStatus;
  rejection_reason?: string;
  approved_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new mongoose.Schema<IAchievement>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      blocks: [
        {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      ],
      time: Number,
      version: String,
    },
    interests: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Interest',
          required: true,
        },
      ],
      validate: {
        validator: async function (interests: mongoose.Types.ObjectId[]) {
          const user = await mongoose.model('User').findById(this.user);
          if (!user) return false;

          // Check if ALL interests exist in user's interest list
          return interests.every((interest) =>
            user.interests.some(
              (userInterest: mongoose.Types.ObjectId) =>
                userInterest.toString() === interest.toString(),
            ),
          );
        },
        message: "All interests must be from user's interest list",
      },
      required: true,
    },
    likes_count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejection_reason: {
      type: String,
      required: function (this: IAchievement) {
        return this.status === 'rejected';
      },
    },
    approved_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
achievementSchema.index({ user: 1, createdAt: -1 });
achievementSchema.index({ interests: 1 });
achievementSchema.index({ status: 1, createdAt: -1 });

// Virtual for assets
achievementSchema.virtual('assets', {
  ref: 'Asset',
  localField: '_id',
  foreignField: 'related_id',
  match: { related_model: 'Achievement' },
});

// Pre-save middleware to set approved_at date
achievementSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'approved') {
    this.approved_at = new Date();
  }
  next();
});

const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);

export default Achievement;
