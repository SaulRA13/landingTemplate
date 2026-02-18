'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateContent } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Content } from '@/lib/content';
import { Save } from 'lucide-react';

// This schema now matches the simplified content structure from your backend
const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  mainText: z.string().min(1, 'Main text is required'),
  description: z.string().optional(),
  image: z.string().optional(),
});

type ContentEditorProps = {
  initialContent: Content;
};

export default function ContentEditor({ initialContent }: ContentEditorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<Content>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
        title: initialContent.title || '',
        mainText: initialContent.mainText || '',
        description: initialContent.description || '',
        image: initialContent.image || '',
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateContent(data);
      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Landing page content has been updated.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Something went wrong.',
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Content Editor</CardTitle>
          <CardDescription>
            Modify the text displayed on your landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
           <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register('title')} />
              {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainText">Main Text</Label>
              <Textarea id="mainText" {...form.register('mainText')} rows={6} />
               {form.formState.errors.mainText && <p className="text-sm text-destructive">{form.formState.errors.mainText.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register('description')} rows={4} placeholder="Additional description..." />
               {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" {...form.register('image')} placeholder="https://example.com/image.jpg" />
               {form.formState.errors.image && <p className="text-sm text-destructive">{form.formState.errors.image.message}</p>}
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
                {!isPending && <Save className="ml-2 h-4 w-4" />}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
