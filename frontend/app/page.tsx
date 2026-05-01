'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { createEvent, fetchEvents } from '../lib/api';
import { EventItem } from '../types/event';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001';

export default function DashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [connectionLabel, setConnectionLabel] = useState('disconnected');
  const seenIds = useRef<Set<string>>(new Set());

  const appendEvent = useCallback((incoming: EventItem) => {
    if (seenIds.current.has(incoming.id)) {
      return;
    }

    seenIds.current.add(incoming.id);
    setEvents((prev) => [incoming, ...prev]);
  }, []);

  const refreshEvents = useCallback(async () => {
    const latest = await fetchEvents();
    seenIds.current = new Set(latest.map((item) => item.id));
    setEvents(latest);
  }, []);

  const handleCreateEvent = useCallback(async () => {
    await createEvent();
  }, []);

  useEffect(() => {
    let socket: Socket | null = null;
    let reconnectAttempts = 0;

    const connect = () => {
      socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        reconnectAttempts = 0;
        setConnectionLabel('connected');
      });

      socket.on('disconnect', () => {
        setConnectionLabel('disconnected');
      });

      socket.on('connect_error', () => {
        reconnectAttempts += 1;
        setConnectionLabel(`reconnecting (${reconnectAttempts})`);
      });

      socket.on('new_event', (incoming: EventItem) => {
        appendEvent(incoming);
      });
    };

    connect();
    void refreshEvents();

    return () => {
      socket?.disconnect();
    };
  }, [appendEvent, refreshEvents]);

  const eventCount = useMemo(() => events.length, [events.length]);

  return (
    <main>
      <h1>Real-time Event Feed Dashboard</h1>
      <p>Status: {connectionLabel}</p>
      <p>Total events: {eventCount}</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={handleCreateEvent}>Create Event</button>
        <button onClick={refreshEvents}>Refresh Events</button>
      </div>

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.status.toUpperCase()}</strong>
            <div>{event.message}</div>
            <small>
              {event.id} - {new Date(event.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </main>
  );
}
