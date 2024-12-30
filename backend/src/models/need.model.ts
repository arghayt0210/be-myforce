import mongoose, { Document } from 'mongoose';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type NeedStatus = 'searching' | 'fulfilled' | 'expired';

interface INeed extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  interests: mongoose.Types.ObjectId[];
  event_date: Date;
  is_approved: ApprovalStatus;
  status: NeedStatus;
  rejection_reason?: string;
  approved_at?: Date;
  fulfilled_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const needSchema = new mongoose.Schema<INeed>(
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
      type: String,
      required: true,
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
    event_date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Event date must be in the future',
      },
    },
    is_approved: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['searching', 'fulfilled', 'expired'],
      default: 'searching',
    },
    rejection_reason: {
      type: String,
      required: function (this: INeed) {
        return this.is_approved === 'rejected';
      },
    },
    approved_at: {
      type: Date,
    },
    fulfilled_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Add this virtual populate for assets
needSchema.virtual('assets', {
  ref: 'Asset',
  localField: '_id',
  foreignField: 'related_id',
  match: { related_model: 'Need' },
});

const Need = mongoose.model<INeed>('Need', needSchema);

export default Need;
