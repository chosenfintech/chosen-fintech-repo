// src/components/users/profile/SecurityTab.tsx
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Eye, EyeOff, Lock, Save } from 'lucide-react';
import { useChangePasswordMutation } from '@/redux/user-api';
import { extractApiError } from '@/utils/extract-api-error';
import { changePasswordSchema } from '@/validations/user-validation';
import TwoFactorSection from './TwoFactorSection';

// Extend the base schema to add confirmPassword on the client side only
const passwordFormSchema = changePasswordSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type IPasswordFormData = z.infer<typeof passwordFormSchema>;

interface SecurityTabProps {
  userId: string;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ userId }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<IPasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handlePasswordChange = async (data: IPasswordFormData) => {
    const toastId = toast.loading('Changing password...');

    try {
      const response = await changePassword({
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.dismiss(toastId);
      toast.success(response.message || 'Password changed successfully!');

      form.reset();
      setIsChangingPassword(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error('Password change error:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          if (field in form.getValues()) {
            form.setError(field as keyof IPasswordFormData, {
              message: errorMessage,
            });
          }
        });
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsChangingPassword(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Password and Security
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your password and authentication settings
        </p>
      </div>

      <Separator className="my-6" />

      {/* Password Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Password Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Keep your account secure with a strong password
          </p>
        </div>

        {!isChangingPassword ? (
          <div className="flex justify-between items-center p-4 border-2 border-border rounded-lg bg-card shadow-sm">
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">
                Last changed recently
              </p>
            </div>
            <Button
              onClick={() => setIsChangingPassword(true)}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Change Password
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePasswordChange)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-5">
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            disabled={isLoading}
                            className="h-11 pr-10 border-2 border-primary/30 bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            disabled={isLoading}
                            className="h-11 pr-10 border-2 border-primary/30 bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            disabled={isLoading}
                            className="h-11 pr-10 border-2 border-primary/30 bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  size="lg"
                  className="w-full sm:w-auto font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      <Separator className="my-6" />

      {/* 2FA Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>

        <TwoFactorSection userId={userId} />
      </div>
    </div>
  );
};

export default SecurityTab;
