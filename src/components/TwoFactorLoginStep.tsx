// src/components/TwoFactorLoginStep.tsx
'use client';

import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '@/redux/auth-slice';
import {
  verifyTwoFactorLogin,
  resendTwoFactorCode,
  type TwoFactorState,
} from '../lib/auth';
import type { IUser } from '@/types/user.types';
import toast from 'react-hot-toast';

interface TwoFactorLoginStepProps {
  maskedEmail?: string;
}

export default function TwoFactorLoginStep({
  maskedEmail,
}: TwoFactorLoginStepProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [code, setCode] = useState('');
  const [isResending, startResend] = useTransition();

  const [state, action, pending] = useActionState<TwoFactorState, FormData>(
    verifyTwoFactorLogin,
    { success: false },
  );

  useEffect(() => {
    if (state.success && state.redirectTo && state.user) {
      dispatch(userLoggedIn({ user: state.user as IUser }));
      toast.success('Signed in successfully');
      router.push(state.redirectTo);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router, dispatch]);

  const handleResend = () => {
    startResend(async () => {
      const result = await resendTwoFactorCode();
      if (result.resent) {
        toast.success('A new code has been sent to your email');
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form action={action}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Two-factor authentication
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter the 6-digit code we sent to
              {maskedEmail ? (
                <>
                  {' '}
                  <span className="font-medium text-gray-700">
                    {maskedEmail}
                  </span>
                </>
              ) : (
                ' your email'
              )}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-5">
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="code"
              >
                Verification code
              </label>
              <input
                className="w-full h-12 px-4 text-center text-lg tracking-[0.5em] font-semibold
                           bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                           placeholder:tracking-normal placeholder:text-gray-400 placeholder:font-normal
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           hover:border-gray-300 transition-colors"
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                placeholder="------"
                required
                autoFocus
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-medium
                         flex items-center justify-center gap-2
                         transition-colors shadow-sm active:scale-[0.99]"
              aria-disabled={pending || code.length !== 6}
            >
              {pending ? 'Verifying…' : 'Verify and sign in'}
              {!pending && <ArrowRight className="h-4 w-4" />}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending…' : "Didn't get a code? Resend"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
