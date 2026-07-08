// src/components/events/categories/EventCategoryForm.tsx
'use client';

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
import { Loader2, ArrowLeft, LayoutGrid } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IEventCategory } from '@/types/events/category.types';

interface IEventCategoryFormData {
  name: string;
}

interface IEventCategoryFormProps {
  form: UseFormReturn<IEventCategoryFormData>;
  onSubmit: (data: IEventCategoryFormData) => Promise<void>;
  isLoading: boolean;
  initialData?: IEventCategory | null;
  mode: 'create' | 'update';
}

export default function EventCategoryForm({
  form,
  onSubmit,
  isLoading,
  mode,
}: IEventCategoryFormProps) {
  return (
    <div className="w-full">
      <BackLink
        href="/dashboard/events/categories"
        className="mb-4 text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </BackLink>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    <LayoutGrid className="h-4 w-4" />
                    EventCategory Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name..."
                      className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-lg h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Choose a descriptive name for this category
                  </p>
                </FormItem>
              )}
            />

            {/* Submit Section */}
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
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : mode === 'create' ? (
                  'Create EventCategory'
                ) : (
                  'Update EventCategory'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
