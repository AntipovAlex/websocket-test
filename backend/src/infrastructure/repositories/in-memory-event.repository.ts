import { Injectable } from '@nestjs/common';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventRepository } from '../../domain/interfaces/event.repository';

@Injectable()
export class InMemoryEventRepository implements EventRepository {
  private readonly events: EventEntity[] = [];

  async save(event: EventEntity): Promise<void> {
    this.events.unshift(event);
  }

  async findAll(): Promise<EventEntity[]> {
    return [...this.events];
  }
}
