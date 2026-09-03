'use client';

import { useState } from 'react';
import {
  Utensils,
  Film,
  TreePine,
  Gift,
  Beer,
  Sofa,
  Heart,
  ArrowLeft,
  PartyPopper,
  Loader2,
  Calendar,
  CreditCard,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { activities, formatDay, formatTime, type Activity } from '@/lib/dates';
import { createDateRequest } from '@/lib/api';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils,
  Film,
  TreePine,
  Gift,
  Beer,
  Sofa,
};

// Escalating memes shown on the 1st and 2nd "No" — a 3rd "No" is just ignored (see chooseNo).
const NO_REACTION_IMAGES = ['/images/no-1-nojao.jpg', '/images/no-2-cejas.jpg'];

type Step =
  | 'intro'
  | 'noReaction'
  | 'reaction'
  | 'activity'
  | 'subcategory'
  | 'schedule'
  | 'transition'
  | 'payment'
  | 'success';

export default function AskOutForm() {
  const [step, setStep] = useState<Step>('intro');
  const [history, setHistory] = useState<Step[]>([]);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [subcategory, setSubcategory] = useState('');
  const [day, setDay] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [noClickCount, setNoClickCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const goTo = (next: Step) => {
    setHistory((h) => [...h, step]);
    setStep(next);
  };

  const goBack = () => {
    setHistory((h) => {
      const copy = [...h];
      const prev = copy.pop();
      if (prev) setStep(prev);
      return copy;
    });
  };

  // "No" isn't really an option: the first two times, it just guilt-trips with a meme
  // and sends her back to try again. The third time, it's simply ignored as if she said yes.
  const chooseNo = () => {
    const nextCount = noClickCount + 1;
    setNoClickCount(nextCount);
    if (nextCount >= NO_REACTION_IMAGES.length + 1) {
      goTo('reaction');
    } else {
      goTo('noReaction');
    }
  };

  const chooseActivity = (chosen: Activity) => {
    setActivity(chosen);
    setSubcategory('');
    goTo(chosen.subcategories.length > 0 ? 'subcategory' : 'schedule');
  };

  const chooseSubcategory = (chosen: string) => {
    setSubcategory(chosen);
    goTo('schedule');
  };

  const handleConfirmPayment = async () => {
    if (!activity || !day || !pickupTime) return;

    setIsSubmitting(true);
    setError('');
    try {
      // Fake "processing" delay for comedic effect before the real submission.
      await new Promise((resolve) => setTimeout(resolve, 1400));
      await createDateRequest({
        activity: activity.label,
        subcategory,
        day,
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
      </CardHeader>
      <CardContent>
        {step === 'intro' && (
          <div className="space-y-6 text-center">
            <p className="text-lg font-medium">¿Quieres salir conmigo?</p>
            <div className="flex items-center justify-center gap-4 py-2">
              <Button size="lg" onClick={() => goTo('reaction')}>
                Sí <Heart className="ml-2 h-4 w-4" />
              </Button>
              <button
                type="button"
                onClick={chooseNo}
                className={cn(
                  badgeVariants({ variant: 'outline' }),
                  'h-11 px-8 text-sm cursor-pointer select-none'
                )}
              >
                No :c
              </button>
            </div>
          </div>
        )}

        {step === 'noReaction' && (
          <div className="space-y-4 text-center">
            <img
              src={NO_REACTION_IMAGES[Math.min(noClickCount, NO_REACTION_IMAGES.length) - 1]}
              alt="reacción"
              className="mx-auto max-h-64 rounded-lg object-contain"
            />
            <Button onClick={() => goTo('intro')}>Apoco si? →</Button>
          </div>
        )}

        {step === 'reaction' && (
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold">YA SABÍA QUE SÍ QUERÍAS CHIQUITA 😏</p>
            <p className="text-sm text-muted-foreground">Nomás no te hagas del rogar</p>
            <Button onClick={() => goTo('activity')}>ok, ok →</Button>
          </div>
        )}

        {step === 'activity' && (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">¿Hay algo que quieras hacer? tú date bby</p>
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

        {step === 'schedule' && activity && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-center">Entonces... ¿cuándo estás libre?</p>
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-medium">{activity.label}</span>
              {subcategory && <span className="text-muted-foreground"> · {subcategory}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Elige un día</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="day"
                  type="date"
                  required
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTime">¿A qué hora paso por ti?</Label>
              <input
                id="pickupTime"
                type="time"
                required
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button type="button" variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button className="flex-1" disabled={!day || !pickupTime} onClick={() => goTo('transition')}>
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {step === 'transition' && activity && (
          <div className="space-y-4 text-center">
            <Car className="mx-auto h-8 w-8 text-primary" />
            <p className="text-lg font-semibold">Ya te quiero ver chiquibeibe.</p>
            <p className="text-sm">
              Te espero lista el: <span className="font-medium">{formatDay(day)}</span>,{' '}
              <span className="font-medium">{formatTime(pickupTime)}</span>, yo paso por ti
            </p>
            <p className="text-xs text-muted-foreground">
              P.D. Alch sí le copié al del reel pero no me arrepiento.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-center">
              <Button type="button" variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button onClick={() => goTo('payment')}>ok, acepto</Button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4 text-center">
            <CreditCard className="mx-auto h-8 w-8 text-primary" />
            <p className="text-lg font-semibold">Una pequeña cuota</p>
            <p className="text-xs text-muted-foreground">
              Para confirmar que aceptas esta cita, completa la siguiente transacción. Totalmente normal. Todos lo hacen.
            </p>

            <div className="rounded-lg border p-4 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium">Date Agreement™</span>
                <span className="text-lg font-bold">$499</span>
              </div>
              <p className="text-xs text-muted-foreground">cuota única • no reembolsable • totalmente vale la pena</p>
            </div>
            <p className="text-xs text-muted-foreground">
              También se acepta pago con tus dulces o arrimones
            </p>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button className="w-full" onClick={handleConfirmPayment} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando pago...
                </>
              ) : (
                'pagar $499 y confirmar'
              )}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={goBack} disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              regresar
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <PartyPopper className="h-10 w-10 text-primary" />
            <p className="text-lg font-medium">¡"Pago" procesado! Ya me llegó tu respuesta.</p>
            <p className="text-sm text-muted-foreground">Voy a estar puntual, no faltes 💜</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
