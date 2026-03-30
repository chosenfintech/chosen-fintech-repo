'use server';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './session';
import { SigninSchema } from '@/validations/signin-validation';
import { IUser } from '@/types/user.types';

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
        password: true,
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
