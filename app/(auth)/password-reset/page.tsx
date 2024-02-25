'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { resetPassword } from '@/app/_utils/api/auth';


type FormValues = {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
};

export default function PasswordReset() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      setIsLoading(true);
      await resetPassword(data.email, data.verificationCode, data.newPassword);
      toast.success('Password reset successful. You can now login with your new password.');
      router.replace('/login');
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-xl text-indigo-600 font-semibold text-center">Password Reset</h1>
      <div className="w-[25rem] mt-7">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Email Address"
              className="input-field"
            />
            <p className="text-red-600 text-sm">{errors.email?.message}</p>
          </div>
          <div>
            <input
              id="verificationCode"
              type="text"
              {...register('verificationCode', { required: 'Verification code is required' })}
              placeholder="Verification Code"
              className="input-field"
            />
            <p className="text-red-600 text-sm">{errors.verificationCode?.message}</p>
          </div>
          <div>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword', { required: 'New password is required' })}
              placeholder="New Password"
              className="input-field"
            />
            <p className="text-red-600 text-sm">{errors.newPassword?.message}</p>
          </div>
          <div>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { required: 'Confirm password is required' })}
              placeholder="Confirm Password"
              className="input-field"
            />
            <p className="text-red-600 text-sm">{errors.confirmPassword?.message}</p>
          </div>
          <div className="mt-3">
            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
