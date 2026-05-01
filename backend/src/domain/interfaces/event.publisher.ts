import { EventEntity } from '../entities/event.entity';

export interface EventPublisher {
  publishNewEvent(event: EventEntity): Promise<void>;
}

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');
