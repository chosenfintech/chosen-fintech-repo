// src/app/login/page.tsx
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="relative flex items-center justify-center min-h-screen bg-center py-6">
      <div className="relative z-10">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
