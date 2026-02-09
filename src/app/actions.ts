'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getImageById, type Content, placeholderImages } from '@/lib/content';
import { suggestAlternativeLayouts } from '@/ai/flows/suggest-alternative-layouts';
import fs from 'fs/promises';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

export async function getContent(): Promise<Content> {
  try {
    const content = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading content file:", error);
    // Return a default structure in case of error
    return {
      hero: { headline: "", subheadline: "", cta: "", imageId: "" },
      features: [],
      cta: { headline: "", cta: "" }
    };
  }
}

async function saveContent(newContent: Content): Promise<void> {
  try {
    await fs.writeFile(contentFilePath, JSON.stringify(newContent, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving content file:", error);
    throw new Error("Could not save content.");
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

  const { username, password } = parsed.data;

  // IMPORTANT: In a real application, use a secure way to store and verify credentials.
  if (username === 'admin' && password === 'password') {
    cookies().set('auth_token', 'user-is-authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true };
  } else {
    return { error: 'Invalid username or password.' };
  }
}

export async function logout() {
  cookies().delete('auth_token');
  redirect('/login');
}

export async function updateContent(content: Content) {
  const cookieStore = cookies();
  if (!cookieStore.get('auth_token')) {
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    await saveContent(content);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Failed to save content.' };
  }
}

async function imageUrlToBase64(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mime = response.headers.get('content-type') || 'image/jpeg';
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.error(`Error converting image URL to Base64: ${imageUrl}`, error);
    return null;
  }
}

export async function getLayoutSuggestions() {
  const cookieStore = cookies();
  if (!cookieStore.get('auth_token')) {
    throw new Error('Unauthorized');
  }

  const content = await getContent();

  const texts = [
    content.hero.headline,
    content.hero.subheadline,
    ...content.features.map(f => f.title),
    ...content.features.map(f => f.description),
    content.cta.headline,
  ].filter(Boolean);
  
  const allImageIds = [content.hero.imageId, ...content.features.map(f => f.imageId)];
  const imageUrls = allImageIds
    .map(id => getImageById(id)?.imageUrl)
    .filter((url): url is string => !!url);

  const imagePromises = imageUrls.map(imageUrlToBase64);
  const images = (await Promise.all(imagePromises)).filter((img): img is string => !!img);

  if (texts.length === 0 || images.length === 0) {
    return { layoutSuggestions: [] };
  }

  try {
    const result = await suggestAlternativeLayouts({ texts, images });
    return result;
  } catch (error) {
    console.error('Error getting layout suggestions:', error);
    return { layoutSuggestions: ['Error generating suggestions. Please try again.'] };
  }
}
