import activitiesData from '@/data/activities.json';

export type Activity = {
  id: string;
  label: string;
  icon: string;
  subcategories: string[];
};

export const activities: Activity[] = activitiesData;

export type DateRequestInput = {
  activity: string;
  subcategory: string;
  day: string;
  pickupTime: string;
  notes: string;
};

export function formatDay(value: string): string {
  if (!value) return value;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
}

export function formatTime(value: string): string {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const hour24 = Number(match[1]);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${match[2]} ${period}`;
}

export type DateRequest = {
  id: string;
  activity: string;
  subcategory: string;
  day: string;
  pickupTime: string;
  notes: string;
  status: string;
  // ISO string, as returned by the backend's DateTime serialization
  createdAt: string;
};
