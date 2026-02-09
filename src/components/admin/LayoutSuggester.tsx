'use client';

import { useState, useTransition } from 'react';
import { getLayoutSuggestions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wand2, Loader2, Lightbulb } from 'lucide-react';

export default function LayoutSuggester() {
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSuggest = () => {
    startTransition(async () => {
      const result = await getLayoutSuggestions();
      setSuggestions(result.layoutSuggestions);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-center gap-2 bg-primary/10 text-primary-foreground border-primary/20 hover:bg-primary/20"
          onClick={handleSuggest}
        >
          <Wand2 className="h-4 w-4" />
          AI Layout Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary"/>
            AI Layout Suggestions
          </DialogTitle>
          <DialogDescription>
            Here are a few alternative layout ideas based on your current content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating ideas...</span>
            </div>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 flex-shrink-0 text-accent mt-1" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
