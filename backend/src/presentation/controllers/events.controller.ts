import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEventDto } from '../../application/dto/create-event.dto';
import { CreateEventCommand } from '../../application/commands/create-event.command';
import { GetEventsQuery } from '../../application/queries/get-events.query';
import { EventEntity } from '../../domain/entities/event.entity';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getEvents(): Promise<EventEntity[]> {
    return this.queryBus.execute(new GetEventsQuery());
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEvent(@Body() body: CreateEventDto): Promise<{ success: boolean; event: EventEntity | null }> {
    try {
      const created = await this.commandBus.execute(
        new CreateEventCommand(body.message, body.status),
      );

      return {
        success: created !== null,
        event: created,
      };
    } catch (error) {
      this.logger.error('Controller failed to dispatch create command', error instanceof Error ? error.stack : undefined);
      return {
        success: false,
        event: null,
      };
    }
  }
}
