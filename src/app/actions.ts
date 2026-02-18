'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Content } from '@/lib/content';

const API_BASE_URL = process.env.API_BASE_URL || 'http://cloudlandingapi:8080';

export async function getContent(): Promise<Content> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/content`, {
      cache: 'no-store', // Ensure we always get fresh content from the backend
    });

    if (!response.ok) {
      console.error("Error fetching content:", response.status, response.statusText);
      return { title: "Error Loading Content", mainText: "Could not load content from the backend API. Please ensure the backend is running." };
    }
    
    return await response.json();

  } catch (error) {
    console.error("Error connecting to backend:", error);
    return { title: "Connection Error", mainText: "Could not connect to the backend. Please ensure it's running and the API_BASE_URL is correct." };
  }
}

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginState = {
  error?: string;
  success?: boolean;
};

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: 'Invalid form data.' };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Invalid username or password.' }));
        return { error: errorData.message || 'Invalid username or password.' };
    }

    const { token } = await response.json();

    if (token) {
        cookies().set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/',
        });
        return { success: true };
    } else {
        return { error: 'Login failed: no token received from backend.' };
    }
  } catch(e) {
      console.error(e);
      return { error: 'Could not connect to the authentication service.' };
  }
}

export async function logout() {
  cookies().delete('auth_token');
  redirect('/login');
}

export async function updateContent(content: Content) {
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    return { success: false, error: 'Unauthorized. Please log in again.' };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(content),
    });

    if (!response.ok) {
        // Try to parse error from backend, otherwise provide a generic message
        const errorText = await response.text();
        console.error('Failed to update content:', errorText);
        return { success: false, error: `Failed to update content. Server responded with: ${response.status}` };
    }
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to save content due to a network error.' };
  }
}
