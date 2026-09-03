'use client';

import { useState } from 'react';
import { Utensils, Film, TreePine, Gift, Heart, ArrowLeft, PartyPopper, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { activities, type Activity } from '@/lib/dates';
import { createDateRequest } from '@/lib/api';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils,
  Film,
  TreePine,
  Gift,
};

type Step = 'activity' | 'subcategory' | 'details' | 'success';

export default function AskOutForm() {
  const [step, setStep] = useState<Step>('activity');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [subcategory, setSubcategory] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const chooseActivity = (chosen: Activity) => {
    setActivity(chosen);
    setSubcategory('');
    setStep(chosen.subcategories.length > 0 ? 'subcategory' : 'details');
  };

  const chooseSubcategory = (chosen: string) => {
    setSubcategory(chosen);
    setStep('details');
  };

  const goBack = () => {
    if (step === 'subcategory') setStep('activity');
    else if (step === 'details') setStep(activity && activity.subcategories.length > 0 ? 'subcategory' : 'activity');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !pickupTime) return;

    setIsSubmitting(true);
    setError('');
    try {
      await createDateRequest({
        activity: activity.label,
        subcategory,
        pickupTime,
        notes,
      });
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">¿Salimos? 💜</CardTitle>
        {step !== 'success' && (
          <CardDescription>Cuéntame qué se te antoja y a qué hora paso por ti.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {step === 'activity' && (
          <div className="grid grid-cols-2 gap-3">
            {activities.map((item) => {
              const Icon = icons[item.icon] ?? Heart;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseActivity(item)}
                  className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 'subcategory' && activity && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{activity.label} — ¿qué tipo?</p>
            <div className="flex flex-wrap gap-2">
              {activity.subcategories.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => chooseSubcategory(option)}
                  className={cn(
                    badgeVariants({ variant: 'outline' }),
                    'cursor-pointer px-3 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        )}

        {step === 'details' && activity && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-medium">{activity.label}</span>
              {subcategory && <span className="text-muted-foreground"> · {subcategory}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTime">¿A qué hora quieres que pase por ti?</Label>
              <input
                id="pickupTime"
                type="time"
                required
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">¿Algo más que deba saber? (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ej. antojo de algo en especial, ropa cómoda, etc."
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button type="button" variant="ghost" size="sm" onClick={goBack} disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting || !pickupTime}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar invitación'
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <PartyPopper className="h-10 w-10 text-primary" />
            <p className="text-lg font-medium">¡Listo! Ya me llegó tu respuesta.</p>
            <p className="text-sm text-muted-foreground">Voy a estar puntual, no faltes 💜</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
