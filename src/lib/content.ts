
// This defines the structure of the content coming from your C# backend.
export type Content = {
  title: string;
  mainText: string;
  // Allows for other potential fields from the backend
  [key: string]: any; 
};
