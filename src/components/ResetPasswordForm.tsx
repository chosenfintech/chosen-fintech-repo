// src/components/ResetPasswordForm.tsx
'use client';

import { KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { useActionState, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword, type ResetPasswordState } from '../lib/auth';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const [state, action, pending] = useActionState<ResetPasswordState, FormData>(
    resetPassword,
    { success: false },
  );

  useEffect(() => {
    if (state.success && state.redirectTo) {
      toast.success(state.message ?? 'Password reset successfully');
      router.push(state.redirectTo);
    } else if (state.errors) {
      const firstError =
        state.errors._form?.[0] ??
        state.errors.token?.[0] ??
        state.errors.password?.[0];
      if (firstError) toast.error(firstError);
    }
  }, [state, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (password !== confirmPassword) {
      e.preventDefault();
      setConfirmError('Passwords do not match');
      return;
    }
    setConfirmError(null);
  };

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
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose a new password for your account
          </p>
        </div>

        {!token ? (
          <div className="px-8 py-8 space-y-5 text-center">
            <p className="text-sm text-red-600">
              This reset link is invalid or incomplete. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <form action={action} onSubmit={handleSubmit}>
            <div className="px-8 py-6 space-y-5">
              <input type="hidden" name="token" value={token} />

              {/* New password */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  New password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="w-full h-11 pl-10 pr-10 text-sm
                               bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                               placeholder:text-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               hover:border-gray-300 transition-colors"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {state.errors?.password && (
                  <p className="text-xs text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="confirmPassword"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="w-full h-11 pl-10 pr-4 text-sm
                               bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                               placeholder:text-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               hover:border-gray-300 transition-colors"
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {confirmError && (
                  <p className="text-xs text-red-500">{confirmError}</p>
                )}
              </div>

              {state.errors?._form && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <ul className="list-disc pl-4 space-y-0.5">
                    {state.errors._form.map((error) => (
                      <li key={error} className="text-xs text-red-600">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700
                           text-white text-sm font-medium
                           flex items-center justify-center gap-2
                           transition-colors shadow-sm active:scale-[0.99]"
                aria-disabled={pending}
              >
                {pending ? 'Resetting…' : 'Reset password'}
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
