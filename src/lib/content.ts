import fs from 'fs/promises';
import path from 'path';
import imageData from './placeholder-images.json';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
  imageId: string;
};

export type Content = {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    imageId: string;
  };
  features: Feature[];
  cta: {
    headline: string;
    cta: string;
  };
};

export const placeholderImages: ImagePlaceholder[] = imageData.placeholderImages;

export function getImageById(id: string): ImagePlaceholder | undefined {
  return placeholderImages.find(img => img.id === id);
}

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

export async function saveContent(newContent: Content): Promise<void> {
  try {
    await fs.writeFile(contentFilePath, JSON.stringify(newContent, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving content file:", error);
    throw new Error("Could not save content.");
  }
}
