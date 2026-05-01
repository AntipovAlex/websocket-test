import { EventStatus } from '../../domain/entities/event.entity';

export class CreateEventDto {
  message!: string;
  status!: EventStatus;
}
