// src/components/LoginForm.tsx
'use client';
import { AtSign, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signin, type SigninState } from '../lib/auth';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [state, action, pending] = useActionState<SigninState, FormData>(
    signin,
    { success: false },
  );

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <form action={action} className="space-y-6">
          <div className="bg-white p-4 md:p-8 shadow-2xl rounded-2xl border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">Chosen Fintech</h1>
              <p className="mt-3 text-sm text-gray-500">
                Sign in to your account to continue
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="relative group">
                  <input
                    className="block w-full px-4 py-3 pl-11 text-sm
                               bg-gray-50 border border-gray-200 rounded-xl
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 ease-in-out
                               placeholder:text-gray-400 group-hover:border-gray-300"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                  <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
                </div>
                {state?.errors?.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {state.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    className="block w-full px-4 py-3 pl-11 text-sm
                               bg-gray-50 border border-gray-200 rounded-xl
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 ease-in-out
                               placeholder:text-gray-400 group-hover:border-gray-300"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    minLength={4}
                  />
                  <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
                </div>
                {state?.errors?.password && (
                  <div className="mt-2 p-4 bg-red-50 rounded-xl border border-red-100">
                    <ul className="list-disc pl-5 space-y-1">
                      {state.errors.password.map((error) => (
                        <li key={error} className="text-sm text-red-600">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Remember me / Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              <input type="hidden" name="redirectTo" value={callbackUrl} />

              <Button
                className="w-full py-3 rounded-xl
                           transition-all duration-200 ease-in-out shadow-lg
                           hover:shadow-xl flex items-center justify-center
                           text-sm font-medium"
                aria-disabled={pending}
              >
                {pending ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <a
                    href="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
