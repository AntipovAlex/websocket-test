import { Injectable, Logger } from '@nestjs/common';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventPublisher } from '../../domain/interfaces/event.publisher';

@Injectable()
export class RabbitMqPublisherStub implements EventPublisher {
  private readonly logger = new Logger(RabbitMqPublisherStub.name);

  async publishNewEvent(event: EventEntity): Promise<void> {
    this.logger.debug(`RabbitMQ stub: queued event ${event.id}`);
  }
}
