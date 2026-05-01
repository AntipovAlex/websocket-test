export type EventStatus = 'pending' | 'success' | 'error';

export interface EventItem {
  id: string;
  message: string;
  status: EventStatus;
  createdAt: string;
}
