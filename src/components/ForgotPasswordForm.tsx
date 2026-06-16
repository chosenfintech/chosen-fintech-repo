// src/components/ForgotPasswordForm.tsx
'use client';

import { AtSign, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { forgotPassword, type ForgotPasswordState } from '../lib/auth';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const [state, action, pending] = useActionState<ForgotPasswordState, FormData>(
    forgotPassword,
    { success: false },
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-4">
            <Image
              src="/logo.jpg"
              alt="Chosen Fintech Logo"
              width={38}
              height={38}
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Forgot your password?
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {state.success ? (
          <div className="px-8 py-8 space-y-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50">
              <MailCheck className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">{state.message}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form action={action}>
            <div className="px-8 py-6 space-y-5">
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="w-full h-11 pl-10 pr-4 text-sm
                               bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                               placeholder:text-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               hover:border-gray-300 transition-colors"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700
                           text-white text-sm font-medium
                           flex items-center justify-center gap-2
                           transition-colors shadow-sm active:scale-[0.99]"
                aria-disabled={pending}
              >
                {pending ? 'Sending…' : 'Send reset link'}
                {!pending && <ArrowRight className="h-4 w-4" />}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
