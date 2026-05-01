import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateEventHandler } from './application/commands/create-event.handler';
import { GetEventsHandler } from './application/queries/get-events.handler';
import { EVENT_REPOSITORY } from './domain/interfaces/event.repository';
import { EVENT_PUBLISHER } from './domain/interfaces/event.publisher';
import { InMemoryEventRepository } from './infrastructure/repositories/in-memory-event.repository';
import { EventsGateway } from './infrastructure/websocket/events.gateway';
import { WebSocketPublisher } from './infrastructure/messaging/websocket.publisher';
import { RabbitMqPublisherStub } from './infrastructure/messaging/rabbitmq.publisher.stub';
import { EventsController } from './presentation/controllers/events.controller';

const commandHandlers = [CreateEventHandler];
const queryHandlers = [GetEventsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [EventsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    EventsGateway,
    InMemoryEventRepository,
    WebSocketPublisher,
    RabbitMqPublisherStub,
    {
      provide: EVENT_REPOSITORY,
      useExisting: InMemoryEventRepository,
    },
    {
      provide: EVENT_PUBLISHER,
      useExisting: WebSocketPublisher,
    },
  ],
})
export class AppModule {}
