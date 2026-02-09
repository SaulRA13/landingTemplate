import imageData from './placeholder-images.json';

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
