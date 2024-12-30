import cron from 'node-cron';
import Need from '@/models/need.model';
import logger from '@/utils/logger.util';

export const initializeCronJobs = () => {
  // Run every hour to check for expired needs
  cron.schedule(
    '0 * * * *',
    async () => {
      try {
        const now = new Date();

        // Update all approved, searching needs with past event dates to expired
        const result = await Need.updateMany(
          {
            is_approved: 'approved',
            status: 'searching',
            event_date: { $lt: now },
          },
          {
            $set: { status: 'expired' },
          },
        );

        if (result.modifiedCount > 0) {
          logger.info(`Marked ${result.modifiedCount} needs as expired`);
        }
      } catch (error) {
        logger.error('Error in need expiration cron job:', error);
      }
    },
    {
      scheduled: true,
      timezone: 'UTC',
    },
  );
};
