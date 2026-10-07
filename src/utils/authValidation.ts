import { z } from 'zod';

/**
 * Bangladesh mobile phone validator regex
 * 01[3-9]XXXXXXXX (11 digits)
 */
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

export const loginEmailPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid work email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(true),
});

export type LoginEmailPasswordFormValues = z.infer<typeof loginEmailPasswordSchema>;

export const loginPhoneOTPSchema = z.object({
  phone: z
    .string()
    .min(1, 'Mobile number is required')
    .refine((val) => {
      const clean = val.replace(/\D/g, '').replace(/^88/, '');
      return BD_PHONE_REGEX.test(clean);
    }, 'Enter a valid 11-digit Bangladesh mobile number (e.g. 01712345678)'),
  rememberMe: z.boolean().default(true),
});

export type LoginPhoneOTPFormValues = z.infer<typeof loginPhoneOTPSchema>;

export const forgotPasswordSchema = z.object({
  method: z.enum(['email', 'sms']),
  identifier: z.string().min(1, 'Please enter your email or phone number'),
}).superRefine((data, ctx) => {
  if (data.method === 'email') {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);
    if (!isEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['identifier'],
        message: 'Please enter a valid email address',
      });
    }
  } else {
    const clean = data.identifier.replace(/\D/g, '').replace(/^88/, '');
    if (!BD_PHONE_REGEX.test(clean)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['identifier'],
        message: 'Please enter a valid 11-digit BD mobile number (01XXXXXXXXX)',
      });
    }
  }
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    otpCode: z
      .string()
      .length(6, 'Verification code must be 6 digits')
      .regex(/^\d+$/, 'Code must be numbers only'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const adminRegisterSchema = z
  .object({
    organizationName: z
      .string()
      .min(2, 'Organization name must be at least 2 characters'),
    fullName: z
      .string()
      .min(3, 'Full name must be at least 3 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid corporate email'),
    phone: z
      .string()
      .min(1, 'Mobile number is required')
      .refine((val) => {
        const clean = val.replace(/\D/g, '').replace(/^88/, '');
        return BD_PHONE_REGEX.test(clean);
      }, 'Enter a valid 11-digit BD mobile number (01XXXXXXXXX)'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/[0-9]/, 'Password must include a number')
      .regex(/[^A-Za-z0-9]/, 'Password must include a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    division: z.string().default('Dhaka'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Enterprise Service terms & conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;
