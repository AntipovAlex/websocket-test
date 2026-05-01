import { EventEntity } from '../entities/event.entity';

export interface EventRepository {
  save(event: EventEntity): Promise<void>;
  findAll(): Promise<EventEntity[]>;
}

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');
