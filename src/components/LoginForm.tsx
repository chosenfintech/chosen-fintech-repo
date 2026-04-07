'use client';

import { AtSign, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useActionState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '@/redux/auth-slice';
import { signin, type SigninState } from '../lib/auth';
import type { IUser } from '@/types/user.types';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [state, action, pending] = useActionState<SigninState, FormData>(
    signin,
    { success: false },
  );

  useEffect(() => {
    if (state.success && state.redirectTo && state.user) {
      dispatch(userLoggedIn({ user: state.user as IUser }));
      toast.success('Signed in successfully');
      router.push(state.redirectTo);
    } else if (!state.success && state.errors) {
      const firstError =
        state.errors._form?.[0] ??
        state.errors.email?.[0] ??
        state.errors.password?.[0];
      if (firstError) toast.error(firstError);
    }
  }, [state, router, dispatch]);

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form action={action}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Chosen Fintech
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Admin portal — sign in to continue
            </p>
          </div>

          {/* Form body */}
          <div className="px-8 py-6 space-y-5">
            {/* Email */}
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
                />
              </div>
              {state?.errors?.email && (
                <p className="text-xs text-red-500">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  className="w-full h-11 pl-10 pr-4 text-sm
                             bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                             placeholder:text-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             hover:border-gray-300 transition-colors"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  minLength={4}
                />
              </div>
              {state?.errors?.password && (
                <div className="mt-1 p-3 bg-red-50 rounded-xl border border-red-100">
                  <ul className="list-disc pl-4 space-y-0.5">
                    {state.errors.password.map((error) => (
                      <li key={error} className="text-xs text-red-600">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Remember me / Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />

            {/* Form-level errors */}
            {state?.errors?._form && (
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
              {pending ? 'Signing in…' : 'Sign in'}
              {!pending && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
