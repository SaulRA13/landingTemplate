
// This defines the structure of the content coming from your C# backend.
export type ContentSection = {
  title: string;
  mainText: string;
  description?: string;
  image?: string;
};

export type Content = {
  title: string;
  mainText: string;
  description?: string;
  image?: string;
  sections?: ContentSection[];
  // Allows for other potential fields from the backend
  [key: string]: any;
};
