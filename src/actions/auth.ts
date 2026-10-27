'use server';

import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { loginSchema, registerSchema } from '@/lib/validators';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    role: (formData.get('role') as string) || 'TOURIST',
  };

  const validated = registerSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { name, email, password, role } = validated.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'An account with this email already exists' };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role as any,
    },
  });

  // Auto sign in
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch {
    // Sign in error - user can manually login
  }

  redirect('/');
}

export async function loginUser(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validated = loginSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await signIn('credentials', {
      email: rawData.email,
      password: rawData.password,
      redirect: false,
    });
  } catch {
    return { error: 'Invalid email or password' };
  }

  redirect('/');
}

export async function logoutUser() {
  await signOut({ redirect: false });
  redirect('/');
}
