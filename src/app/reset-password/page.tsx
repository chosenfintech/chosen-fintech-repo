// src/app/reset-password/page.tsx
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-900 py-10">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
