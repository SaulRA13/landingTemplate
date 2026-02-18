'use client';

import { useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import type { Content, ContentSection } from '@/lib/content';
import { Plus, Save, Trash2 } from 'lucide-react';

const sectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  mainText: z.string().min(1, 'Main text is required'),
  description: z.string().optional(),
  image: z.string().optional(),
});

// This schema now matches the simplified content structure from your backend
const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  mainText: z.string().min(1, 'Main text is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  sections: z.array(sectionSchema).optional(),
});

type ContentEditorProps = {
  initialContent: Content;
};

const numberedFieldRegex = /^(title|mainText|description|image)(\d+)$/;

function getNumberedSections(content: Content): ContentSection[] {
  const sectionMap = new Map<number, Partial<ContentSection>>();

  for (const [key, value] of Object.entries(content)) {
    const match = key.match(numberedFieldRegex);
    if (!match) {
      continue;
    }

    const index = Number(match[2]);
    if (!Number.isFinite(index) || index < 2) {
      continue;
    }

    const field = match[1] as keyof ContentSection;
    const existing = sectionMap.get(index) ?? {};
    existing[field] = typeof value === 'string' ? value : '';
    sectionMap.set(index, existing);
  }

  return Array.from(sectionMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, section]) => ({
      title: section.title || '',
      mainText: section.mainText || '',
      description: section.description || '',
      image: section.image || '',
    }));
}

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
        sections: Array.isArray(initialContent.sections) && initialContent.sections.length > 0
          ? initialContent.sections
          : getNumberedSections(initialContent),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sections',
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
        <CardContent className="space-y-6 pt-6">
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
          <div className="space-y-4 border-t pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Additional Sections</p>
                <p className="text-sm text-muted-foreground">Add more blocks to show on the landing page.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: '', mainText: '', description: '', image: '' })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
            <div className="space-y-6">
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">No extra sections yet.</p>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">Section {index + 2}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sections.${index}.title`}>Title</Label>
                    <Input id={`sections.${index}.title`} {...form.register(`sections.${index}.title` as const)} />
                    {form.formState.errors.sections?.[index]?.title && (
                      <p className="text-sm text-destructive">{form.formState.errors.sections[index]?.title?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sections.${index}.mainText`}>Main Text</Label>
                    <Textarea id={`sections.${index}.mainText`} {...form.register(`sections.${index}.mainText` as const)} rows={5} />
                    {form.formState.errors.sections?.[index]?.mainText && (
                      <p className="text-sm text-destructive">{form.formState.errors.sections[index]?.mainText?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sections.${index}.description`}>Description</Label>
                    <Textarea
                      id={`sections.${index}.description`}
                      {...form.register(`sections.${index}.description` as const)}
                      rows={3}
                      placeholder="Additional description..."
                    />
                    {form.formState.errors.sections?.[index]?.description && (
                      <p className="text-sm text-destructive">{form.formState.errors.sections[index]?.description?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sections.${index}.image`}>Image URL</Label>
                    <Input
                      id={`sections.${index}.image`}
                      {...form.register(`sections.${index}.image` as const)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {form.formState.errors.sections?.[index]?.image && (
                      <p className="text-sm text-destructive">{form.formState.errors.sections[index]?.image?.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
