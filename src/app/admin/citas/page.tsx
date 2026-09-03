'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Loader2, Clock, CheckCircle2, PartyPopper } from 'lucide-react';
import { getDateRequests, getAuthToken, updateDateRequestStatus } from '@/lib/api';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DateRequest } from '@/lib/dates';

const STATUS_FLOW: Record<string, { next: string; label: string; icon: typeof CheckCircle2 } | undefined> = {
  pending: { next: 'confirmed', label: 'Confirmar', icon: CheckCircle2 },
  confirmed: { next: 'done', label: 'Marcar como realizada', icon: PartyPopper },
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  done: 'Realizada',
};

const STATUS_VARIANTS: Record<string, 'secondary' | 'default' | 'outline'> = {
  pending: 'secondary',
  confirmed: 'default',
  done: 'outline',
};

export default function CitasPage() {
  const [dateRequests, setDateRequests] = useState<DateRequest[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  const loadDateRequests = () => {
    setIsLoading(true);
    setError(null);
    getDateRequests()
      .then(setDateRequests)
      .catch((err) => {
        console.error('Error loading date requests:', err);
        setError('No se pudieron cargar las citas.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    loadDateRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleAdvanceStatus = async (request: DateRequest) => {
    const step = STATUS_FLOW[request.status];
    if (!step) return;

    setUpdatingId(request.id);
    try {
      await updateDateRequestStatus(request.id, step.next);
      setDateRequests((prev) =>
        prev ? prev.map((r) => (r.id === request.id ? { ...r, status: step.next } : r)) : prev
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError('No se pudo actualizar el estado de esa cita.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 p-3 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="font-headline text-xl sm:text-2xl font-bold">Citas</h1>
              <p className="text-sm text-muted-foreground">Lo que tu novia va registrando.</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadDateRequests} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
          {!isLoading && error && <p className="text-sm text-destructive">{error}</p>}
          {!isLoading && !error && dateRequests?.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                Todavía no hay citas registradas.
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {!isLoading &&
              !error &&
              dateRequests?.map((request) => {
                const step = STATUS_FLOW[request.status];
                const StepIcon = step?.icon;
                return (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base sm:text-lg">{request.activity}</CardTitle>
                          {request.subcategory && (
                            <CardDescription>{request.subcategory}</CardDescription>
                          )}
                        </div>
                        <Badge variant={STATUS_VARIANTS[request.status] ?? 'secondary'}>
                          {STATUS_LABELS[request.status] ?? request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>Paso por ella a las {request.pickupTime}</span>
                      </div>
                      {request.notes && (
                        <p className="text-sm text-muted-foreground">"{request.notes}"</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Registrada el {new Date(request.createdAt).toLocaleString()}
                      </p>
                      {step && (
                        <Button
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleAdvanceStatus(request)}
                          disabled={updatingId === request.id}
                        >
                          {updatingId === request.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            StepIcon && <StepIcon className="mr-2 h-4 w-4" />
                          )}
                          {step.label}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
