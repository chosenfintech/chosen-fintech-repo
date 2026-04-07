// src/components/posts/PostForm.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
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
import { Loader2, X, Upload, ArrowLeft, Calendar } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IPostFormSchema } from '@/validations/posts/post-validation';
import { IPost } from '@/types/posts/post.types';
import RichTextInput from '@/components/RichTextEditor';
import { useGetCategoriesForSelectQuery } from '@/redux/posts/category-api';
import { format, parseISO, isValid } from 'date-fns';
import { parseBoolean } from '@/utils/parse-booleans';

interface IPostFormProps {
  form: UseFormReturn<IPostFormSchema>;
  onSubmit: (data: IPostFormSchema) => Promise<void>;
  isLoading: boolean;
  initialData?: IPost | null;
  mode: 'create' | 'update';
}

/**
 * Formats a date value for display: "Jan 15, 2025 at 2:30 PM"
 */
const formatDisplayDateTime = (
  value: string | Date | undefined | null,
): string => {
  if (!value) return '';
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    return isValid(date) ? format(date, "MMM d, yyyy 'at' h:mm a") : '';
  } catch {
    return '';
  }
};

/**
 * Formats a date value for display (date only): "Jan 15, 2025"
 */
const formatDisplayDate = (value: string | Date | undefined | null): string => {
  if (!value) return '';
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    return isValid(date) ? format(date, 'MMM d, yyyy') : '';
  } catch {
    return '';
  }
};

/**
 * Formats a date value for a datetime-local input: "2025-01-15T14:30"
 */
const toDateTimeLocalFormat = (
  value: string | Date | undefined | null,
): string => {
  if (!value) return '';
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    return isValid(date) ? format(date, "yyyy-MM-dd'T'HH:mm") : '';
  } catch {
    return '';
  }
};

export default function PostForm({
  form,
  onSubmit,
  isLoading,
  initialData,
  mode,
}: IPostFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: categories } = useGetCategoriesForSelectQuery();

  useEffect(() => {
    if (initialData?.coverImage && mode === 'update') {
      setImagePreview(initialData.coverImage);
    }
  }, [initialData, mode]);

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        form.setError('coverImage', {
          type: 'manual',
          message: 'Please select a valid image file',
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        form.setError('coverImage', {
          type: 'manual',
          message: 'Image size should be less than 10MB',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      form.setValue('coverImage', file);
      form.clearErrors('coverImage');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('coverImage', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isPublished = form.watch('isPublished');

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-foreground">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter an engaging title..."
                          className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-lg h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-foreground">
                        Excerpt
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a compelling summary that will make readers want to read more..."
                          className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        This will appear in post previews and search results
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-foreground">
                        Content
                      </FormLabel>
                      <FormControl>
                        <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                          <RichTextInput
                            value={field.value || ''}
                            onChange={field.onChange}
                            minLength={100}
                            maxLength={10000}
                            required={true}
                            placeholder="Start writing your post content here..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Post Settings */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Post Settings
                  </h3>

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-foreground font-medium">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={initialData?.category?.id || 'none'}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                              <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {(categories || []).map((category) => (
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

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                          <FormControl>
                            <Checkbox
                              checked={parseBoolean(field.value)}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium">
                              Publish Post
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Make this post visible to readers
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                          <FormControl>
                            <Checkbox
                              checked={parseBoolean(field.value)}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium">
                              Featured Post
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Highlight on homepage and featured sections
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date Settings */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    <Calendar className="inline-block mr-2 h-5 w-5" />
                    Date Settings
                  </h3>

                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-foreground font-medium">
                          Publish Date
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="datetime-local"
                              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              value={toDateTimeLocalFormat(field.value)}
                              onChange={(e) =>
                                field.onChange(e.target.value || undefined)
                              }
                            />
                            {field.value && (
                              <p className="text-xs text-muted-foreground">
                                {formatDisplayDateTime(field.value)}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                        {mode === 'update' && (
                          <p className="text-xs text-muted-foreground">
                            {initialData?.publishDate
                              ? `Current: ${formatDisplayDateTime(initialData.publishDate)}. Leave empty to keep unchanged.`
                              : 'Leave empty to set publish date automatically when publishing'}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="createdAt"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-foreground font-medium">
                          Created At
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="datetime-local"
                              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              value={toDateTimeLocalFormat(field.value)}
                              onChange={(e) =>
                                field.onChange(e.target.value || undefined)
                              }
                            />
                            {field.value && (
                              <p className="text-xs text-muted-foreground">
                                {formatDisplayDate(field.value)}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                        {mode === 'update' && (
                          <p className="text-xs text-muted-foreground">
                            {initialData?.createdAt
                              ? `Current: ${formatDisplayDate(initialData.createdAt)}. Leave empty to keep unchanged.`
                              : 'Override the creation date if needed'}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="updatedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Updated At
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="datetime-local"
                              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              value={toDateTimeLocalFormat(field.value)}
                              onChange={(e) =>
                                field.onChange(e.target.value || undefined)
                              }
                            />
                            {field.value && (
                              <p className="text-xs text-muted-foreground">
                                {formatDisplayDate(field.value)}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                        {mode === 'update' && (
                          <p className="text-xs text-muted-foreground">
                            {initialData?.updatedAt
                              ? `Current: ${formatDisplayDate(initialData.updatedAt)}. Leave empty for automatic update.`
                              : 'Leave empty for automatic update date'}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Cover Image */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium text-base">
                          Cover Image
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {imagePreview && (
                              <div className="relative w-full h-48">
                                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-600 shadow-sm">
                                  <Image
                                    src={imagePreview}
                                    alt="Cover image preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                  aria-label="Remove image"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )}

                            <div className="relative">
                              <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageChange(e.target.files?.[0])
                                }
                                disabled={isLoading}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-white dark:bg-slate-800 border-dashed border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 h-24 transition-all"
                                disabled={isLoading}
                              >
                                <div className="text-center">
                                  <Upload className="mx-auto h-6 w-6 mb-2 text-muted-foreground" />
                                  <p className="text-sm font-medium">
                                    {imagePreview
                                      ? 'Change Image'
                                      : 'Upload Cover Image'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    JPG, PNG, GIF up to 10MB
                                  </p>
                                </div>
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-6 py-2 hover:cursor-pointer border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 min-w-[140px] shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPublished
                      ? mode === 'create'
                        ? 'Publishing...'
                        : 'Updating...'
                      : 'Saving...'}
                  </>
                ) : isPublished ? (
                  mode === 'create' ? (
                    'Publish Post'
                  ) : (
                    'Update Post'
                  )
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
