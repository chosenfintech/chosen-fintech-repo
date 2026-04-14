// src/lib/auth.ts
'use server';
import { headers } from 'next/headers';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './session';
import { SigninSchema } from '@/validations/signin-validation';
import { IUser } from '@/types/user.types';
import { ratelimit } from '@/lib/rate-limit';

type FormErrors = {
  email?: string[];
  password?: string[];
  _form?: string[];
};

export type SigninState = {
  success: boolean;
  redirectTo?: string;
  user?: IUser;
  errors?: FormErrors;
};

async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullname: true,
        phone: true,
        isAdmin: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function signin(
  _state: SigninState,
  formData: FormData,
): Promise<SigninState> {
  // --- Rate limiting ---
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'unknown';

  const { success: allowed, reset } = await ratelimit.limit(ip);

  if (!allowed) {
    const retrySecs = Math.ceil((reset - Date.now()) / 1000);
    return {
      success: false,
      errors: {
        _form: [
          `Too many login attempts. Please try again in ${retrySecs} seconds.`,
        ],
      },
    };
  }
  // --- End rate limiting ---

  const parsedCredentials = SigninSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsedCredentials.success) {
    return {
      success: false,
      errors: parsedCredentials.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsedCredentials.data;

  const user = await getUser(email);

  if (!user) {
    return {
      success: false,
      errors: { _form: ['Invalid email or password'] },
    };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return {
      success: false,
      errors: { _form: ['Invalid email or password'] },
    };
  }

  await createSession(user.id, user.isAdmin);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeUser } = user;

  return {
    success: true,
    redirectTo: '/dashboard',
    user: safeUser,
  };
}

export async function logout(): Promise<void> {
  await deleteSession();
}
