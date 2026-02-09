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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { placeholderImages, type Content } from '@/lib/content';
import { Save } from 'lucide-react';

const contentSchema = z.object({
  hero: z.object({
    headline: z.string().min(1, 'Headline is required'),
    subheadline: z.string().min(1, 'Subheadline is required'),
    cta: z.string().min(1, 'CTA text is required'),
    imageId: z.string().min(1, 'Hero image is required'),
  }),
  features: z.array(z.object({
    id: z.string(),
    icon: z.string(),
    title: z.string().min(1, 'Feature title is required'),
    description: z.string().min(1, 'Feature description is required'),
    imageId: z.string().min(1, 'Feature image is required'),
  })),
  cta: z.object({
    headline: z.string().min(1, 'CTA headline is required'),
    cta: z.string().min(1, 'CTA text is required'),
  }),
});

type ContentEditorProps = {
  initialContent: Content;
};

export default function ContentEditor({ initialContent }: ContentEditorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<Content>({
    resolver: zodResolver(contentSchema),
    defaultValues: initialContent,
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
            Modify the text and images displayed on your landing page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['hero', 'features', 'cta']} className="w-full">
            <AccordionItem value="hero">
              <AccordionTrigger className="font-headline text-lg">Hero Section</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="hero.headline">Headline</Label>
                  <Input {...form.register('hero.headline')} />
                  {form.formState.errors.hero?.headline && <p className="text-sm text-destructive">{form.formState.errors.hero.headline.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero.subheadline">Subheadline</Label>
                  <Textarea {...form.register('hero.subheadline')} />
                   {form.formState.errors.hero?.subheadline && <p className="text-sm text-destructive">{form.formState.errors.hero.subheadline.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero.cta">CTA Button Text</Label>
                    <Input {...form.register('hero.cta')} />
                     {form.formState.errors.hero?.cta && <p className="text-sm text-destructive">{form.formState.errors.hero.cta.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Image</Label>
                     <Select value={form.watch('hero.imageId')} onValueChange={(value) => form.setValue('hero.imageId', value)}>
                        <SelectTrigger><SelectValue placeholder="Select an image" /></SelectTrigger>
                        <SelectContent>
                          {placeholderImages.map(img => <SelectItem key={img.id} value={img.id}>{img.description}</SelectItem>)}
                        </SelectContent>
                      </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="features">
              <AccordionTrigger className="font-headline text-lg">Features Section</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                {form.getValues().features.map((_, index) => (
                  <div key={index} className="space-y-4 rounded-lg border p-4">
                    <h4 className="font-semibold font-headline">Feature {index + 1}</h4>
                     <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...form.register(`features.${index}.title`)} />
                        {form.formState.errors.features?.[index]?.title && <p className="text-sm text-destructive">{form.formState.errors.features[index]?.title?.message}</p>}
                     </div>
                     <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea {...form.register(`features.${index}.description`)} />
                        {form.formState.errors.features?.[index]?.description && <p className="text-sm text-destructive">{form.formState.errors.features[index]?.description?.message}</p>}
                     </div>
                     <div className="space-y-2">
                        <Label>Image</Label>
                         <Select value={form.watch(`features.${index}.imageId`)} onValueChange={(value) => form.setValue(`features.${index}.imageId`, value)}>
                            <SelectTrigger><SelectValue placeholder="Select an image" /></SelectTrigger>
                            <SelectContent>
                              {placeholderImages.map(img => <SelectItem key={img.id} value={img.id}>{img.description}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="cta">
              <AccordionTrigger className="font-headline text-lg">Call to Action Section</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="cta.headline">Headline</Label>
                  <Input {...form.register('cta.headline')} />
                  {form.formState.errors.cta?.headline && <p className="text-sm text-destructive">{form.formState.errors.cta.headline.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta.cta">Button Text</Label>
                  <Input {...form.register('cta.cta')} />
                  {form.formState.errors.cta?.cta && <p className="text-sm text-destructive">{form.formState.errors.cta.cta.message}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
