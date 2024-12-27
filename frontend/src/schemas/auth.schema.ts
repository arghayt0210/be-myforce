import { z } from 'zod';

export const registerSchema = z.object({
    full_name: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must not exceed 50 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    profile_image: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: 'Profile image must be less than 5MB',
      })
      .refine(
        (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        {
          message: 'Only .jpg, .png, and .webp formats are supported',
        }
      ),
  });
  
  export type RegisterInput = z.infer<typeof registerSchema>;