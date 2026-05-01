import { EventStatus } from '../../domain/entities/event.entity';

export class CreateEventCommand {
  constructor(
    public readonly message: string,
    public readonly status: EventStatus,
  ) {}
}
