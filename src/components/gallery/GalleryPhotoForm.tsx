'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, X, Upload, ArrowLeft, ImageIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IGalleryPhotoFormSchema } from '@/validations/gallery/gallery-photo-validation';
import { parseBoolean } from '@/utils/parse-booleans';
import { useGetGalleryCategoriesForSelectQuery } from '@/redux/gallery/gallery-category-api';

interface IGalleryPhotoFormProps {
  form: UseFormReturn<IGalleryPhotoFormSchema>;
  onSubmit: (data: IGalleryPhotoFormSchema, imageFile: File) => Promise<void>;
  isLoading: boolean;
}

export default function GalleryPhotoForm({
  form,
  onSubmit,
  isLoading,
}: IGalleryPhotoFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useGetGalleryCategoriesForSelectQuery();

  const isPublished = form.watch('isPublished');

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
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

  const handleSubmit = async (data: IGalleryPhotoFormSchema) => {
    if (!imageFile) {
      setImageError('A photo is required');
      return;
    }
    await onSubmit(data, imageFile);
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-4 text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Image upload */}
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  Photo
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  JPG, PNG, GIF, WebP up to 10MB
                </p>
              </div>

              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                    <Image
                      src={imagePreview}
                      alt="Photo preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                      aria-label="Remove photo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {imageFile?.name}
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

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Category
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(categories ?? []).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alt text */}
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Alt Text
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe the photo for accessibility..."
                      className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Used by screen readers and when the image cannot load
                  </p>
                </FormItem>
              )}
            />

            {/* Caption */}
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Caption
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a caption to display with the photo..."
                      className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <FormLabel className="font-medium">Publish Photo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Make this photo visible to the public
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
                    {parseBoolean(isPublished) ? 'Publishing...' : 'Saving...'}
                  </>
                ) : parseBoolean(isPublished) ? (
                  'Publish Photo'
                ) : (
                  'Save as Draft'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
