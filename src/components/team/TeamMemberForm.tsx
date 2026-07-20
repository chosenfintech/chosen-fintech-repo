// src/components/team/TeamMemberForm.tsx
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BackLink } from '@/components/BackLink';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  X,
  Upload,
  ArrowLeft,
  ImageIcon,
  Facebook,
  Linkedin,
  Mail,
} from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ITeamMemberFormSchema } from '@/validations/team/team-member-validation';
import { parseBoolean } from '@/utils/parse-booleans';

interface ITeamMemberFormProps {
  form: UseFormReturn<ITeamMemberFormSchema>;
  /** `imageFile` is null on edit when the existing photo is being kept. */
  onSubmit: (
    data: ITeamMemberFormSchema,
    imageFile: File | null,
  ) => Promise<void>;
  isLoading: boolean;
  /** Photo already on file - present only when editing. */
  existingImageUrl?: string;
  submitLabel?: string;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export default function TeamMemberForm({
  form,
  onSubmit,
  isLoading,
  existingImageUrl,
  submitLabel,
}: ITeamMemberFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPublished = form.watch('isPublished');

  // The newly-picked file wins; otherwise fall back to the stored photo.
  const previewSrc = imagePreview ?? existingImageUrl ?? null;

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image size must be less than 10MB');
      return;
    }

    setImageError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (data: ITeamMemberFormSchema) => {
    if (!imageFile && !existingImageUrl) {
      setImageError('A photo is required');
      return;
    }
    await onSubmit(data, imageFile);
  };

  return (
    <div className="w-full">
      <BackLink
        href="/dashboard/team"
        className="mb-4 text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </BackLink>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Photo */}
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  Photo
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  A portrait works best - JPG, PNG, WebP up to 10MB
                </p>
              </div>

              {previewSrc ? (
                <div className="space-y-3">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                    <Image
                      src={previewSrc}
                      alt="Team member preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 640px"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                        aria-label="Remove selected photo"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {imageFile?.name ?? 'Current photo'}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    disabled={isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              ) : (
                <div
                  className="border-dashed border-2 border-slate-300 dark:border-slate-600 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      fileInputRef.current?.click();
                  }}
                >
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Click to upload a photo
                  </p>
                </div>
              )}

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
                disabled={isLoading}
              />

              {imageError && (
                <p className="text-sm font-medium text-destructive">
                  {imageError}
                </p>
              )}
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Full Name
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Mohammed Mustapha Yakubu"
                      className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Role
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Founder & CEO"
                      className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Socials */}
            <div className="space-y-5">
              <p className="text-lg font-semibold text-foreground">
                Contact & Social Links
              </p>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@chosenfintech.org"
                        className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Facebook className="h-4 w-4" />
                      Facebook URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/username"
                        className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <span className="font-bold text-base leading-none">
                        X
                      </span>
                      X / Twitter URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://x.com/username"
                        className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Display order */}
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Display Order
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={9999}
                      className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:max-w-[200px]"
                      {...field}
                      value={field.value ?? 0}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Lower numbers appear first on the About page
                  </p>
                </FormItem>
              )}
            />

            {/* Publish */}
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <FormControl>
                    <Checkbox
                      checked={parseBoolean(field.value)}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">
                      Show on the website
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Publish this member to the public About page
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-6 py-2 hover:cursor-pointer border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all order-2 sm:order-1"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 min-w-[140px] shadow-lg transition-all order-1 sm:order-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  (submitLabel ??
                  (parseBoolean(isPublished)
                    ? 'Publish Member'
                    : 'Save as Draft'))
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
