'use server';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './session';
import { redirect } from 'next/navigation';
import { SigninSchema } from '@/validations/signin-validation';

type FormErrors = {
  email?: string[];
  password?: string[];
  _form?: string[];
};

export type SigninState = {
  success: boolean;
  redirectTo?: string;
  errors?: FormErrors;
};

async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function signin(
  _state: SigninState,
  formData: FormData,
): Promise<SigninState> {
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
      errors: { email: ['Invalid credentials'] },
    };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    return {
      success: false,
      errors: { password: ['Invalid credentials'] },
    };
  }

  await createSession(user.id);
  return { success: true, redirectTo: '/dashboard' };
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect('/login');
}
