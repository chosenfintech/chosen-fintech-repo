// src/components/users/profile/ProfileInfoTab.tsx
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Loader2, Save, Edit3 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IUser } from '@/types/user.types';
import { useUpdateUserMutation } from '@/redux/user-api';
import { extractApiError } from '@/utils/extract-api-error';
import {
  updateUserSchema,
  IUpdateUserSchema,
} from '@/validations/user-validation';

interface ProfileInfoTabProps {
  user: IUser;
  currentUser: IUser | null;
}

const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  user,
  currentUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const isViewingOwnProfile = currentUser?.id === user.id;
  const isAdmin = currentUser?.isAdmin ?? false;
  const canEdit = isViewingOwnProfile || isAdmin;

  const form = useForm<IUpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullname: user.fullname || '',
      email: user.email || '',
      phone: user.phone || '',
    },
  });

  const userInitials = user.fullname
    ? user.fullname
        .split(' ')
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const handleCancelProfileEdit = () => {
    form.reset({
      fullname: user.fullname || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setIsEditing(false);
  };

  const handleSubmitProfile = async (data: IUpdateUserSchema) => {
    const toastId = toast.loading('Updating profile...');

    try {
      const response = await updateUser({
        userId: user.id,
        body: {
          fullname: data.fullname,
          email: data.email,
          phone: data.phone ?? undefined,
        },
      }).unwrap();

      toast.dismiss(toastId);
      toast.success(response.message || 'Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          if (field in form.getValues()) {
            form.setError(field as keyof IUpdateUserSchema, {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Profile Information
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {canEdit
            ? 'Manage your personal information and account details'
            : 'View user profile information'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 border-2 border-border rounded-lg bg-card shadow-sm">
          <Avatar className="h-24 w-24 ring-4 ring-primary/20 dark:ring-primary/30">
            <AvatarFallback className="bg-linear-to-br from-primary via-primary to-primary/80 text-primary-foreground font-bold text-2xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">
              {user.fullname}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {user.isAdmin && (
              <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitProfile)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        disabled={!isEditing || isLoading || !canEdit}
                        className={`h-11 font-medium transition-all duration-200 ${
                          isEditing && canEdit
                            ? 'border-2 border-primary/40 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20'
                            : 'border-2 border-border bg-muted/50 text-foreground'
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        disabled={!isEditing || isLoading || !canEdit}
                        className={`h-11 font-medium transition-all duration-200 ${
                          isEditing && canEdit
                            ? 'border-2 border-primary/40 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20'
                            : 'border-2 border-border bg-muted/50 text-foreground'
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder="Enter your phone number"
                        disabled={!isEditing || isLoading || !canEdit}
                        className={`h-11 font-medium transition-all duration-200 ${
                          isEditing && canEdit
                            ? 'border-2 border-primary/40 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20'
                            : 'border-2 border-border bg-muted/50 text-foreground'
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <>
                <Separator className="my-6 bg-border" />
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                  {!isEditing ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelProfileEdit}
                        size="lg"
                        className="w-full sm:w-auto border-2 border-border hover:bg-muted hover:border-foreground/20 font-semibold"
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
                    </>
                  )}
                </div>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileInfoTab;
