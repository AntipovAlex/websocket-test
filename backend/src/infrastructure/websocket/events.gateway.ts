import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventEntity } from '../../domain/entities/event.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server!: Server;

  emitNewEvent(event: EventEntity): void {
    this.server.emit('new_event', event);
  }
}
