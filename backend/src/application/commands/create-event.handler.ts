import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CreateEventCommand } from './create-event.command';
import { EventEntity } from '../../domain/entities/event.entity';
import {
  EVENT_REPOSITORY,
  EventRepository,
} from '../../domain/interfaces/event.repository';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/interfaces/event.publisher';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand, EventEntity | null> {
  private readonly logger = new Logger(CreateEventHandler.name);

  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateEventCommand): Promise<EventEntity | null> {
    try {
      const event = new EventEntity(
        uuidv4(),
        command.message,
        command.status,
        new Date(),
      );

      await this.eventRepository.save(event);
      await this.eventPublisher.publishNewEvent(event);

      return event;
    } catch (error) {
      this.logger.error('Failed to create event', error instanceof Error ? error.stack : undefined);
      return null;
    }
  }
}
