// src/components/contact/ContactForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { extractApiError } from '@/utils/extract-api-error';
import { useSendContactMessageMutation } from '@/redux/contact/contact-api';
import {
  CONTACT_SUBJECTS,
  contactSchema,
  type IContactFormSchema,
  type IContactFormOutput,
} from '@/validations/contact-validation';

/**
 * No boxed controls anywhere on this page: each field is just a hairline that
 * goes solid on focus. Colours come from tokens so the panel reads as plain
 * white in light mode and as the navy slab in dark.
 *
 * The shared FormLabel turns destructive-red on error, which reads as muddy on
 * navy; the label stays quiet and the message below carries the error instead.
 */
const labelClass =
  'text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground data-[error=true]:text-muted-foreground';

const fieldClass =
  'w-full border-0 border-b border-border bg-transparent px-0 pb-3 pt-2 text-base text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary disabled:opacity-50 dark:border-white/25 dark:text-white dark:placeholder:text-white/35 dark:focus:border-white';

export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const form = useForm<IContactFormSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: CONTACT_SUBJECTS[0],
      message: '',
      website: '',
    },
  });

  const selectedSubject = form.watch('subject');

  async function onSubmit(data: IContactFormSchema) {
    const toastId = toast.loading('Sending your message...');

    try {
      const result = await sendContactMessage(
        contactSchema.parse(data) as IContactFormOutput,
      ).unwrap();

      toast.dismiss(toastId);
      toast.success(result.message);
      setSentTo(data.name.trim().split(/\s+/)[0] || 'there');
      form.reset();
    } catch (err) {
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IContactFormSchema, {
            message: errorMessage,
          });
        });
      }

      toast.error(message);
    }
  }

  if (sentTo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[420px] flex-col justify-center"
      >
        <div className="mb-8 flex h-14 w-14 items-center justify-center border border-primary/40 dark:border-white/40">
          <Check className="h-6 w-6 text-primary dark:text-white" strokeWidth={1.5} />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          Message sent
        </p>
        <h3 className="mt-4 text-3xl font-bold leading-tight text-primary sm:text-4xl dark:text-white">
          Thank you, {sentTo}.
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
          A copy is on its way to your inbox. Someone from the team will reply
          there, usually within one working day.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-10 flex w-fit items-center gap-2 border-b border-primary/40 pb-1 text-sm font-semibold uppercase tracking-[0.15em] text-primary transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary dark:border-white/40 dark:text-white dark:hover:border-white dark:focus-visible:outline-white"
        >
          Send another message
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={labelClass}>Your name</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    placeholder="Kofi Owusu"
                    autoComplete="name"
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive dark:text-white/90" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={labelClass}>Email</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive dark:text-white/90" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="mt-8 space-y-2">
              <FormLabel className={labelClass}>Phone (optional)</FormLabel>
              <FormControl>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="+233 55 442 4696"
                  autoComplete="tel"
                  className={fieldClass}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage className="text-destructive dark:text-white/90" />
            </FormItem>
          )}
        />

        {/* Subject chips - four options do not warrant a select, and these stay
            thumb-friendly on a phone. */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="mt-8 space-y-3">
              <FormLabel className={labelClass}>What is it about?</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2.5">
                  {CONTACT_SUBJECTS.map((subject) => {
                    const isSelected = selectedSubject === subject;
                    return (
                      <button
                        key={subject}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          field.onChange(
                            subject as IContactFormSchema['subject'],
                          )
                        }
                        className={cn(
                          'cursor-pointer border px-4 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:focus-visible:outline-white',
                          isSelected
                            ? 'border-primary bg-primary font-medium text-primary-foreground'
                            : 'border-border text-muted-foreground hover:border-primary hover:text-primary dark:border-white/25 dark:text-white/70 dark:hover:border-white dark:hover:text-white',
                        )}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage className="text-destructive dark:text-white/90" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="mt-8 space-y-2">
              <FormLabel className={labelClass}>Message</FormLabel>
              <FormControl>
                <textarea
                  rows={4}
                  maxLength={5000}
                  placeholder="Tell us what you need..."
                  className={cn(fieldClass, 'resize-y')}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-destructive dark:text-white/90" />
            </FormItem>
          )}
        />

        {/* Honeypot: invisible to people, irresistible to bots. */}
        <input
          {...form.register('website')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 bg-primary px-8 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto dark:focus-visible:outline-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send message
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </>
            )}
          </button>

          <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-[14rem] sm:text-right">
            We reply by email, usually within one working day.
          </p>
        </div>
      </form>
    </Form>
  );
}
