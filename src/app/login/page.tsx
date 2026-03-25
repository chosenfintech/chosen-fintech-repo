// src/app/login/page.tsx
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-900 py-10">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
