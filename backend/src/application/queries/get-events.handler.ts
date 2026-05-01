import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventEntity } from '../../domain/entities/event.entity';
import {
  EVENT_REPOSITORY,
  EventRepository,
} from '../../domain/interfaces/event.repository';
import { GetEventsQuery } from './get-events.query';

@QueryHandler(GetEventsQuery)
export class GetEventsHandler implements IQueryHandler<GetEventsQuery, EventEntity[]> {
  private readonly logger = new Logger(GetEventsHandler.name);

  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(): Promise<EventEntity[]> {
    try {
      return await this.eventRepository.findAll();
    } catch (error) {
      this.logger.error('Failed to query events', error instanceof Error ? error.stack : undefined);
      return [];
    }
  }
}
