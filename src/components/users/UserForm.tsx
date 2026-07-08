// src/components/users/UserForm.tsx
'use client';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
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
import { BackLink } from '@/components/BackLink';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ICreateUserSchema } from '@/validations/user-validation';

interface IUserFormProps {
  form: UseFormReturn<ICreateUserSchema>;
  onSubmit: (data: ICreateUserSchema) => Promise<void>;
  isLoading: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  showPasswordField?: boolean;
}

export default function UserForm({
  form,
  onSubmit,
  isLoading,
  submitLabel = 'Create User',
  loadingLabel = 'Creating...',
  showPasswordField = true,
}: IUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <BackLink
        href="/dashboard/users"
        className="mb-4 text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </BackLink>

      <div className="md:bg-white md:dark:bg-slate-800 md:rounded-xl md:border md:border-slate-200 md:dark:border-slate-700 overflow-hidden">
        <div className="p-2 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter full name"
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Phone Number{' '}
                      <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+233 XX XXX XXXX"
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                        disabled={isLoading}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? 'EDITOR'}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EDITOR">
                          Editor — create &amp; edit content
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          Admin — full access, incl. delete &amp; users
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              {showPasswordField && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            className="h-11 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Submit Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto px-6 h-11 transition-all order-2 sm:order-1 hover:cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-8 bg-linear-to-r from-brand-orange to-brand-red hover:from-brand-orange/90 hover:to-brand-red/90 shadow-md hover:shadow-lg transition-all duration-300 font-semibold order-1 sm:order-2 hover:cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {loadingLabel}
                    </>
                  ) : (
                    submitLabel
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
