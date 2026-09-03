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
  pickupTime: string;
  notes: string;
};

export type DateRequest = {
  id: string;
  activity: string;
  subcategory: string;
  pickupTime: string;
  notes: string;
  status: string;
  // ISO string, as returned by the backend's DateTime serialization
  createdAt: string;
};
