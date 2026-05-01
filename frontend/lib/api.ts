import { EventItem, EventStatus } from '../types/event';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchEvents(): Promise<EventItem[]> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function createEvent(): Promise<EventItem | null> {
  const statuses: EventStatus[] = ['pending', 'success', 'error'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Event created at ${new Date().toISOString()}`,
      status,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { success: boolean; event: EventItem | null };
  return payload.success ? payload.event : null;
}
