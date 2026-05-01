import { Injectable, Logger } from '@nestjs/common';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventPublisher } from '../../domain/interfaces/event.publisher';
import { EventsGateway } from '../websocket/events.gateway';

@Injectable()
export class WebSocketPublisher implements EventPublisher {
  private readonly logger = new Logger(WebSocketPublisher.name);
  private readonly maxRetries = 3;

  constructor(private readonly eventsGateway: EventsGateway) {}

  async publishNewEvent(event: EventEntity): Promise<void> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.maxRetries; attempt += 1) {
      try {
        this.eventsGateway.emitNewEvent(event);
        return;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Publish attempt ${attempt} failed`);
      }
    }

    this.logger.error(
      'Unable to publish event after retries',
      lastError instanceof Error ? lastError.stack : undefined,
    );
  }
}
