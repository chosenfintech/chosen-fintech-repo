// src/app/forgot-password/page.tsx
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import { Suspense } from 'react';

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-900 py-10">
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
